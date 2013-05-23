## Flot-Marker ##
==========
A simple plugin to create markers around (or on one of the sides of) a data point.

The marker plugin for Flot makes it easy to set simple pointers (aka markers) for 
data points. Works much like the highlight feature of Flot while it keeps data point 
marker state for you. It provides one liner function calls for (un)setting the marker 
on an item object or data point x and y coordinates so there's no need to keep track 
of which points are marked.

# Options: #
The plugin supports the following default options:

	marker: {
		color: "#000"
        	alignment: ['top', 'left', 'right', 'bottom']
	}

The marker object represents the default settings for the whole plot or series but can be 
overriden by passing the marker options to the setMarker function as arguments when setting 
a marker for a specific data point, see the usage section for details on how to use it.

	color: the default is "rgba(0, 0, 0, 0.80)"
	alignment: the default is to draw a triangular pointer surrounding all sides of the
		data point but you can provide any combination of 'top', 'left', 'right',
		'bottom' in an array to draw these specific pointers only.

The plugin also adds two public methods:

  - setMarker(item, '#000', ['left', 'right']);

    Sets the marker and its color for a specific item object.

  - unsetMarker(item);

    Unsets the marker. Takes only one argument which can either be the item object or an 
    array for the x and y coordinates of this point.
