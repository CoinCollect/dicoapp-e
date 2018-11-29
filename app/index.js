/* eslint-disable */
import { setup } from './utils/config';
import $ from 'jquery';

// Check geo location: USA IPs are not allowed, sorry
let checkGeoLocation = () => {
  $.getJSON('http://gd.geobytes.com/GetCityDetails?callback=?', function(data) {
    if (data.geobytescountry == 'United States') {
      alert(
        "We think you're from the United States. If you are an accredited investor, please contact us. You will now be redirected to coincollect.cc"
      );
      document.location = 'https://www.coincollect.cc';
    }
  });
};

(async () => {
  await setup();
  checkGeoLocation();
  require('./index.renderer');
})();
/* eslint-enable */
