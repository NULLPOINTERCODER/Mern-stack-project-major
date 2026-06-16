// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })

  // Geolocation & Auto-fill code
  const getLocationBtn = document.getElementById('get-location-btn');
  if (getLocationBtn) {
    getLocationBtn.addEventListener('click', () => {
      const locationInput = document.getElementById('location');
      const countryInput = document.getElementById('country');
      
      if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        return;
      }
      
      const originalText = getLocationBtn.innerHTML;
      getLocationBtn.disabled = true;
      getLocationBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>Locating...`;
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
          
          fetch(url)
            .then(res => res.json())
            .then(data => {
              if (data && data.address) {
                const address = data.address;
                const city = address.city || address.town || address.village || address.suburb || address.neighbourhood || address.county || "";
                const state = address.state || "";
                
                if (locationInput) {
                  locationInput.value = [city, state].filter(Boolean).join(", ");
                }
                if (countryInput) {
                  countryInput.value = address.country || "";
                }
              } else {
                alert("Could not retrieve human-readable address for your location.");
              }
            })
            .catch(err => {
              console.error("Reverse geocoding error:", err);
              alert("Error retrieving address information.");
            })
            .finally(() => {
              getLocationBtn.disabled = false;
              getLocationBtn.innerHTML = originalText;
            });
        },
        (error) => {
          console.error("Geolocation error:", error);
          alert(`Unable to retrieve your location: ${error.message}`);
          getLocationBtn.disabled = false;
          getLocationBtn.innerHTML = originalText;
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    });
  }
})();