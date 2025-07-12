(function ($) {
    $(function () {
        var isoCountries = [
          {
              text: "UK",
              dial_code: "+44",
              id: "GB",
          },
          {
              text: "USA",
              dial_code: "+1",
              id: "US",
          },
        ];

        function formatCountry(country) {
            if (!country.id) { return country.text; }
            var $country = $(
              '<span class="fi fi-' + country.id.toLowerCase() + '"></span>' +
              '<span class="flag-text">' + country.dial_code + "</span>"
            );
            return $country;
        };

        function formatTemplate(country) {
            if (!country.id) { return country.text; }
            var $country = $(
              '<span class="fi fi-' + country.id.toLowerCase() + '"></span>' +
              '<span class="flag-text">' + country.text + "</span>"
            );
            return $country;
        };

        $("[name='country']").select2({
            width: '100%',
            placeholder: "Select a country",
            templateResult: formatTemplate,
            templateSelection: formatCountry,
            data: isoCountries
        });


    });
})(jQuery);