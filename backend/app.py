from flask import Flask
from flask import request
import pandas as pd
import geopandas as gpd
import gtfs_functions as gtfs
import zipfile
import os
from werkzeug.utils import secure_filename
import numpy as np


app = Flask(__name__)

@app.route('/files', methods = ['POST'], strict_slashes = False)
def transform_file():
    file = request.files['file']
    filename = secure_filename(file.filename)
    file.save(filename)

    routes, stops, stop_times, trips, shapes = gtfs.import_gtfs(filename)
    
    os.remove(filename)

    #banned route types
    banned = [0,1,2]

    routes = routes[routes.route_type.isin(banned) == False]
    trips = trips[trips.route_id.isin(routes.route_id.unique())]
    stop_times = stop_times[stop_times.trip_id.isin(trips.trip_id.unique())]
    stops = stops[stops.stop_id.isin(stop_times.stop_id.unique())]
    shapes = shapes[shapes.shape_id.isin(trips.shape_id.unique())]

    #cutting segments - takes a long time
    segments_gdf = gtfs.cut_gtfs(stop_times, stops, shapes)

    start = 6
    end = 22

    cutoffs = list(range(start, end + 1))
    seg_freq = gtfs.segments_freq(segments_gdf, stop_times, routes, cutoffs = cutoffs)

    #post-processing - they call headway "frequency" - grrr!
    seg_freq.rename(columns = {'frequency': 'headway',
                           'max_freq': 'max_headway',
                          'ntrips': 'frequency', 
                          'max_trips': 'max_freq'}, inplace = True)

    seg_freq = seg_freq[seg_freq.route_name != 'All lines']

    #first get total trips in the hour for all routes
    hourly = seg_freq.groupby(['segment_id','dir_id', 'window'], as_index = False).agg({'frequency': 'sum'})

    #then from that, get max trips in a 1-hr period for the day
    max_freqs = hourly.groupby(['segment_id', 'dir_id'], as_index = False).agg(max_freq = ('frequency', 'max'))

    #get total trips throughout the day
    df = seg_freq.groupby(['segment_id','dir_id','s_st_id', 's_st_name', 'e_st_name']).agg(
        {'route_name': list, 'frequency': 'sum', 'geometry': 'first'}
    ).reset_index()

    #Get only unique values for the route names
    df['route_name'] = df.route_name.apply(lambda x: ",".join(list(np.unique(x))) if type(x) == str else "null" )

    #merge these 2 metrics back into same dataframe
    df = df.merge(max_freqs, on = ['segment_id', 'dir_id'])

    #Convert to geodataframe and save segments as geojson
    df = gpd.GeoDataFrame(df, geometry = 'geometry')
    json = df.to_json(drop_id = True)

    response = {'data': json}

    return response