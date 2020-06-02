const handlebars = require('handlebars');

module.exports = (count) => {
  let out = '';

  for (let i = 0; i < count; i++) {
    out += '<span class="tomato" data-fill="false"></span>';
  }
  return new handlebars.SafeString(out);
};
