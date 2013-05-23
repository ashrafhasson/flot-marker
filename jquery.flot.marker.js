/* Flot plugin for showing data point flashing markers on overlays.

Copyright (c) 2013 by Ashraf Hasson.
Licensed under the MIT license.

THIS SOFTWARE IS PROVIDED AS IS, WITHOUT ANY WARRANTY, IMPLIED OR OTHREWISE.

Abstract:
The marker plugin for Flot makes it easy to set simple pointer labels (aka markers) for 
data points. Works much like the highlight feature of Flot while it keeps data point 
marker state. It provides one liner function calls for (un)setting the marker on an item 
object or data point x and y coordinates so there's no need to keep track of which points 
are marked.

Options:
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

*/

(function ($) {
    var options = {
	series: {
		marker: {
	            color: "rgba(0, 0, 0, 0.50)",
		    alignment: ['top', 'left', 'right', 'bottom'],
		}
	}
    };

    function setItemPos(item, plot) {
	if ($.isArray(item)) {
		return plot.p2c( { x: item[0], y: item[1] } );
	} else {
        	return plot.p2c(
				{
					pageX: item.pageX,
					pageY: item.pageY,
					x: item.datapoint[0],
					y: item.datapoint[1]
				}
        	);
	}
    }
    
    function init(plot) {
	var markedPoints = [];
	plot.setMarker = function setMarker(item, color, alignment) {
		if (!item) {
			return;
		} else {
		        item.pos = setItemPos(item, plot);
			if (markedPoints.length > 0) {
				var alreadyMarked = false;
				$(markedPoints).each(function(index, itemObj) {
					if (JSON.stringify(itemObj) === JSON.stringify(item)) {
						alreadyMarked = true;
						return false;
					}
				});
				if (! alreadyMarked) {
					if (color)
						item.color = color;
					if (alignment)
						item.alignment = alignment;
					markedPoints.push(item);
				}
			} else {
				if (color)
					item.color = color;
				if (alignment)
					item.alignment = alignment;
				markedPoints.push(item);
			}
			plot.triggerRedrawOverlay();
		}
	}

	plot.unsetMarker = function unsetMarker(item) {
		if (!item) {
			return;
		} else {
			if (markedPoints.length > 0) {
		        	item.pos = setItemPos(item, plot);
				$(markedPoints).each(function(index, itemObj) {
					if (itemObj.color)
						delete itemObj.color;
					if (itemObj.alignment)
						delete itemObj.alignment;
					if (JSON.stringify(itemObj) === JSON.stringify(item)) {
						markedPoints.splice(index,1);
						return false;
					}
				});
				console.log(markedPoints);
			}
			plot.triggerRedrawOverlay();
		}
	}
        plot.hooks.drawOverlay.push(function(plot, ctx) {
          var m = plot.getOptions().series.marker;

            var plotOffset = plot.getPlotOffset();

            ctx.save();
            ctx.translate(plotOffset.left, plotOffset.top);

            if (markedPoints.length > 0) {
                for (i = 0; i < markedPoints.length; i++) {
	            point = markedPoints[i];

                    ctx.lineWidth = 1;
                    ctx.lineJoin = "round";

                    ctx.beginPath();
                    var sides = point.alignment || m.alignment; 
                    $(sides).each(function(index, side) {
			if (side === "top") {
	                    ctx.moveTo(point.pos.left, point.pos.top - 8);
                            ctx.lineTo(point.pos.left - 4.2, point.pos.top - 8 - 3.6);
                            ctx.lineTo(point.pos.left + 4.2, point.pos.top - 8 - 3.6);
                            ctx.lineTo(point.pos.left, point.pos.top - 8);
			} else if (side === "left") {
                            ctx.moveTo(point.pos.left - 8, point.pos.top);
                            ctx.lineTo(point.pos.left - 8 - 3.6, point.pos.top - 4.2);
                            ctx.lineTo(point.pos.left - 8 - 3.6, point.pos.top + 4.2);
                            ctx.lineTo(point.pos.left - 8, point.pos.top);
                        } else if (side === "right") {
	                    ctx.moveTo(point.pos.left + 8, point.pos.top);
                            ctx.lineTo(point.pos.left + 8 + 3.6, point.pos.top - 4.2);
                            ctx.lineTo(point.pos.left + 8 + 3.6, point.pos.top + 4.2);
                            ctx.lineTo(point.pos.left + 8, point.pos.top);
                        } else if (side === "bottom") {
	                    ctx.moveTo(point.pos.left, point.pos.top + 8);
                            ctx.lineTo(point.pos.left - 4.2, point.pos.top + 8 + 3.6);
                            ctx.lineTo(point.pos.left + 4.2, point.pos.top + 8 + 3.6);
                            ctx.lineTo(point.pos.left, point.pos.top + 8);
                        }
                    });
	            ctx.closePath();

	            ctx.fillStyle = point.color || m.color;
	            ctx.fill();
	            ctx.strokeStyle = point.color || m.color;
                    ctx.stroke();
                }
            }

            ctx.restore();
        });
    }

    $.plot.plugins.push({
        init: init,
        options: options,
        name: 'marker',
        version: '0.1'
    });
})(jQuery);
