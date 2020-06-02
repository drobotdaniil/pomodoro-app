import $ from 'jquery';
import 'jquery-ui/ui/widgets/tooltip';

/**
 * jQuery plugin Tooltip
 */
$.fn.uiTooltip = () => {
  $(() => {
    $('#wrapper').tooltip({
      track: true,
      position: {
        my: 'center+35 top+35',
        at: 'right top',
      },
    });
  });
};
