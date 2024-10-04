function getPagination(table) {
    const $table = $(table);
    const $pagination = $('.pagination');

    function updatePagination(maxRows) {
        $pagination.empty();
        const totalRows = $table.find('tbody tr').length;
        const pageCount = Math.ceil(totalRows / maxRows);

        if (pageCount > 1) {
            for (let i = 1; i <= pageCount; i++) {
                $pagination.append(`<li><a href="#" class="px-3 py-2 border rounded hover:bg-gray-200" data-page="${i}">${i}</a></li>`);
            }
        }
    }

    function showPage(pageNum, maxRows) {
        const startIndex = (pageNum - 1) * maxRows;
        const endIndex = startIndex + maxRows;

        $table.find('tbody tr').hide().slice(startIndex, endIndex).show();
        $pagination.find('li').removeClass('active');
        $pagination.find(`a[data-page="${pageNum}"]`).parent().addClass('active');

        updateRowsCount(startIndex + 1, Math.min(endIndex, $table.find('tbody tr').length), $table.find('tbody tr').length);
    }

    function updateRowsCount(start, end, total) {
        $('.rows_count').text(`Showing ${start} to ${end} of ${total} entries`);
    }

    $('#maxRows').on('change', function() {
        const maxRows = parseInt($(this).val(), 10);
        updatePagination(maxRows);
        showPage(1, maxRows);
    });

    $pagination.on('click', 'a', function(e) {
        e.preventDefault();
        const pageNum = parseInt($(this).data('page'), 10);
        const maxRows = parseInt($('#maxRows').val(), 10);
        showPage(pageNum, maxRows);
    });

    // Initialize pagination
    $('#maxRows').trigger('change');
}

function FilterkeyWord_all_table() {
    const searchTerm = $('#search_input_all').val().toLowerCase();
    $('#table-id tbody tr').each(function() {
        const rowText = $(this).text().toLowerCase();
        $(this).toggle(rowText.indexOf(searchTerm) > -1);
    });
    $('#maxRows').trigger('change');
}

function addDataToTable(data) {
    const $tbody = $('#table-id tbody');
    $tbody.empty();
    data.forEach(item => {
        const $row = $('<tr>');
        Object.values(item).forEach(value => {
            $row.append($('<td>').text(value).css('white-space', 'nowrap'));
        });
        $tbody.append($row);
    });
    $('#maxRows').trigger('change');
    $('#table-id').css('overflow-x', 'auto');
}

// Initialize pagination
getPagination('#table-id');

// Bind search function to input
$('#search_input_all').on('keyup', FilterkeyWord_all_table);

// Example usage:
const newData = [
    { sno: 1, location: "कोकर", name: "कोकर दुर्गा पूजा समिति", code: "PK 01" },
    { sno: 2, location: "बांधगाड़ी", name: "श्रीश्री बांधगाड़ी दुर्गा पूजा समिति", code: "PK 02" },
    { sno: 3, location: "बूटी मोड", name: "महाशक्ति दुर्गापूजा समिति", code: "PK 03" },
    { sno: 4, location: "रिम्स कॉलोनी", name: "यंग मोनार्क क्लब", code: "PK 04" },
    { sno: 5, location: "रिम्स गेट", name: "दुर्गा पूजा समिति", code: "PK 05" },
    { sno: 6, location: "बरियातु हाउसिंग कॉलोनी", name: "विनेक्स क्लब पूजा समिति", code: "PK 06" },
    { sno: 7, location: "बरियातु हाउसिंग कॉलोनी", name: "र्स्वण जयंती क्लब", code: "PK 07" },
    { sno: 8, location: "मोरहाबादी", name: "गीतांजलि दुर्गा पूजा समिति", code: "PK 08" },
    { sno: 9, location: "मोरहाबादी", name: "दिव्य ज्योति पूजा समिति", code: "PK 09" },
    { sno: 10, location: "सीसीएल", name: "गांधी नगर पूजा समिति", code: "PK 10" },
    { sno: 11, location: "गोंदा थाना कांके", name: "श्रीश्री दुर्गा पूजा समिति", code: "PK 11" },
    { sno: 12, location: "रातू रोड", name: "आर आर स्पोर्टिग क्लब", code: "PK 12" },
    { sno: 13, location: "लक्ष्मीनगर रातू रोड", name: "शिवसेना क्लब", code: "PK 13" },
    { sno: 14, location: "मधुकम", name: "श्री गोपाल मंदिर दुर्गा पूजा समिति", code: "PK 14" },
    { sno: 15, location: "पिस्का मोड", name: "मां भवानी युवा समिति", code: "PK 15" },
    { sno: 16, location: "पंडरा", name: "दुर्गा पूजा समिति", code: "PK 16" },
    { sno: 17, location: "झीरी मोड पंडरा", name: "नवजागृति युवा क्लब", code: "PK 17" },
    { sno: 18, location: "कचहरी रोड", name: "बिहार क्लब पूजा समिति", code: "PK 18" },
    { sno: 19, location: "कचहरी चौक", name: "संग्राम क्लब", code: "PK 19" },
    { sno: 20, location: "बकरी बाजार", name: "भारतीय युवक संघ", code: "PK 20" },
    { sno: 21, location: "मारवाड़ी कॉलेज के पास", name: "ओसीसी दुर्गा पूजा समिति", code: "PK 21" },
    { sno: 22, location: "ढिबरी पटटी", name: "कला संगम", code: "PK 22" },
    { sno: 23, location: "किशोरगंज", name: "प्रगति प्रतीक क्लब पूजा समिति", code: "PK 23" },
    { sno: 24, location: "शहीद चौक", name: "त्रिकोण हवन कुंड", code: "PK 24" },
    { sno: 25, location: "गडीखाना", name: "शक्ति स्त्रोत संध", code: "PK 25" },
    { sno: 26, location: "अपर बाजार", name: "राजस्थान मित्र मंडल", code: "PK 26" },
    { sno: 27, location: "अपर बाजार", name: "पिंजरापोल पूजा समिति", code: "PK 27" },
    { sno: 28, location: "मेन रोड", name: "चंद्रशेखर आजाद क्लब", code: "PK 28" },
    { sno: 29, location: "मेन रोड", name: "मल्लाह टोली दुर्गा पूजा समिति", code: "PK 29" },
    { sno: 30, location: "मेन रोड", name: "दुर्गाबाड़ी", code: "PK 30" },
    { sno: 31, location: "थड़पखना", name: "देशप्रिय क्लब पूजा समिति", code: "PK 31" },
    { sno: 32, location: "वर्दवान कम्पाउड", name: "हरिमति मंदिर", code: "PK 32" },
    { sno: 33, location: "हिंदपीढी", name: "हिंदपीढी पूजा कमिटी, बैसाखी संघ,", code: "PK 33" },
    { sno: 34, location: "दुर्गामंदिर डेलीमाकंेट", name: "श्री धर्मप्रचारिणी सभा", code: "PK 34" },
    { sno: 35, location: "चर्च रोड", name: "श्री महावीर मंदिर चर्च रोड पूजा समिति", code: "PK 35" },
    { sno: 36, location: "महावीर चौक", name: "यूथ क्लब", code: "PK 36" },
    { sno: 37, location: "कांटा टोली", name: "नेताजी नगर पूजा समिति", code: "PK 37" },
    { sno: 38, location: "हरमू", name: "पंच मंदिर दुर्गा पूजा समिति", code: "PK 38" },
    { sno: 39, location: "हरमू बाइपास", name: "सत्य अमर लोक", code: "PK 39" },
    { sno: 40, location: "हरमू रोड", name: "कल्पना लोक", code: "PK 40" },
    { sno: 41, location: "अरगोडा", name: "श्री दुर्गापूजा एवं रावण दहन समिति", code: "PK 41" },
    { sno: 42, location: "निवारणपुर", name: "निवारणपुर दुर्गा पूजा समिति", code: "PK 42" },
    { sno: 43, location: "ओवरब्रिज", name: "ओवरब्रिज दुर्गा पूजा समिति", code: "PK 43" },
    { sno: 44, location: "डोरंडा", name: "डोरंडा दुर्गा पूजा समिति", code: "PK 44" },
    { sno: 45, location: "डोरंडा", name: "भवानीपुर दुर्गा पूजा समिति", code: "PK 45" },
    { sno: 46, location: "डोरंडा", name: "दुर्गा पूजा समिति छप्पन सेठ", code: "PK 46" },
    { sno: 47, location: "मेकॉन", name: "मेकॉन दुर्गा पूजा समिति", code: "PK 47" },
    { sno: 48, location: "सेेल", name: "पूजा समिति सेल सैटेलाइट टाउनशिप", code: "PK 48" },
    { sno: 49, location: "बिरसा चौक", name: "सार्वजनिक दुर्गा पूजा समिति", code: "PK 49" },
    { sno: 50, location: "बिरसा चौक", name: "बिरसा चौक दुर्गा पूजा समिति", code: "PK 50" },
    { sno: 51, location: "हटिया स्टेशन रोड", name: "हटिया स्टेशन दुर्गा पूजा समिति", code: "PK 51" },
    { sno: 52, location: "एचइसी", name: "सार्वजनिक  दुर्गा पूजा समिति", code: "PK 52" },
    { sno: 53, location: "एचइसी", name: "पंचवटी मैदान पूजा समिति", code: "PK 53" },
    { sno: 54, location: "एचइसी", name: "आश्रम पूजा समिति", code: "PK 54" },
    { sno: 55, location: "एचइसी", name: "मॉटेंसरी पूजा समिति", code: "PK 55" },
    { sno: 56, location: "सेक्टर तीन", name: "यंग ब्लड क्लब पूजा समिति", code: "PK 56" },
    { sno: 57, location: "लटमा हील", name: "आदर्श दुर्गा पूजा समिति", code: "PK 57" },
    { sno: 58, location: "हिनू", name: "हिनूू यूनाइटेड क्लब बिहारी मंडल", code: "PK 58" },
    { sno: 59, location: "हिनू", name: "शक्ति स्त्रोत संध", code: "PK 59" },
    { sno: 60, location: "हिनू", name: "हिनू पूजा समिति बांगाली मंडप", code: "PK 60" },
    { sno: 61, location: "रांची रेलवे स्टेशन", name: "रांची रेलवे स्टेशन पूजा समिति", code: "PK 61" },
    { sno: 62, location: "सरकारी बस स्टैड", name: "आदर्श दुर्गा पूजा समिति", code: "PK 62" },
    { sno: 63, location: "रेलवे कॉलोनी", name: "श्रीश्री सार्वजनिक दुर्गा पूजा समिति", code: "PK 63" },
    { sno: 64, location: "चुटिया", name: "चुटिया पूजा समिति", code: "PK 64" },
    { sno: 65, location: "सदाबहार चौक नामकुम", name: "श्री श्री दुर्गामंदिर पूजा समिति", code: "PK 65" },
    { sno: 66, location: "लोआडीह", name: "नटराज युवक संघ", code: "PK 66" }
];
addDataToTable(newData);


gsap.fromTo("#stat1", { innerText: 0 }, {
    innerText: 15, 
    duration: 3,
    ease: "power1.inOut",
    snap: { innerText: 1 }, 
    stagger: 0.3,
    onUpdate: function () {
        document.getElementById("stat1").innerText = Math.floor(this.targets()[0].innerText) + "L+";
    }
});

gsap.fromTo("#stat2", { innerText: 0 }, {
    innerText: 60, 
    duration: 3,
    ease: "power1.inOut",
    snap: { innerText: 1 },
    delay: 0.5,
    onUpdate: function () {
        document.getElementById("stat2").innerText = Math.floor(this.targets()[0].innerText) + "+";
    }
});

gsap.fromTo("#stat3", { innerText: 0 }, {
    innerText: 100, 
    duration: 3,
    ease: "power1.inOut",
    snap: { innerText: 1 },
    delay: 1,
    onUpdate: function () {
        document.getElementById("stat3").innerText = Math.floor(this.targets()[0].innerText) + "+";
    }
});

function toggleAccordion(index) {
    const content = document.getElementById(`content-${index}`);
    const icon = document.getElementById(`icon-${index}`);
 
    const minusSVG = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-5 h-5">
        <path d="M3.75 7.25a.75.75 0 0 0 0 1.5h8.5a.75.75 0 0 0 0-1.5h-8.5Z" />
      </svg>
    `;
 
    const plusSVG = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-5 h-5">
        <path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
      </svg>
    `;
 
    // Toggle the content's max-height for smooth opening and closing
    if (content.style.maxHeight === '0px' || content.style.maxHeight === '') {
      content.style.maxHeight = content.scrollHeight + 'px';
      icon.innerHTML = minusSVG;
    } else {
      content.style.maxHeight = '0px';
      icon.innerHTML = plusSVG;
    }

    // Force a reflow to ensure the SVG is updated
    icon.offsetHeight;
  }

  document.getElementById('menu-toggle').addEventListener('click', function() {
    const mobileMenu = document.getElementById('mobile-menu');
    mobileMenu.classList.toggle('hidden');
    
    if (!mobileMenu.classList.contains('hidden')) {
      // Animate menu items when opening
      const menuItems = mobileMenu.querySelectorAll('li');
      menuItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(-20px)';
        setTimeout(() => {
          item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          item.style.opacity = '1';
          item.style.transform = 'translateY(0)';
        }, index * 100);
      });
    }
  });

  document.querySelector('.download-mobile-app').addEventListener('click', function(event) {
    event.preventDefault();
    
    const userAgent = navigator.userAgent.toLowerCase();
    const isIOS = /ipad|iphone|ipod/.test(userAgent) && !window.MSStream;
    const isMacOS = /macintosh/.test(userAgent) && navigator.maxTouchPoints > 1;
    
    let downloadUrl;
    if (isIOS || isMacOS) {
      // Replace with the actual iOS App Store URL for Prabhat Khabar app
      downloadUrl = 'https://apps.apple.com/us/app/prabhat-khabar/id792398884';
    } else {
      // Replace with the actual Google Play Store URL for Prabhat Khabar app
      downloadUrl = 'https://play.google.com/store/apps/details?id=com.readwhere.whitelabel.prabhatkhabar&hl=hi';
    }
    
    window.open(downloadUrl, '_blank');
  });

  document.getElementById('vote-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const formData = {
      name: document.querySelector('input[name="name"]').value.trim(),
      mobileNumber: document.querySelector('input[name="mobileNumber"]').value.trim(),
      criteria: document.querySelector('select[name="criteria"]').value,
      pandalCode: document.querySelector('select[name="pandal"]').value
    };

    // Validate name (non-empty string after trimming)
    if (formData.name.trim() === '') {
      alert('Please enter a valid name.');
      return;
    }

    // Validate mobile number (10 digits starting with 6-9)
    if (!/^[6-9]\d{9}$/.test(formData.mobileNumber)) {
      alert('Please enter a valid 10-digit mobile number.');
      return;
    }

    // Validate criteria (non-empty and not 'Select Criteria')
    if (formData.criteria === '' || formData.criteria === 'Select Criteria') {
      alert('Please select a valid criteria.');
      return;
    }

    // Validate pandal code (non-empty and not 'Select Pandal')
    if (formData.pandalCode === '' || formData.pandalCode === 'Select Pandal') {
      alert('Please select a valid pandal.');
      return;
    }

    // Validate mobile number format (assuming Indian mobile number format)
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(formData.mobileNumber)) {
      alert('Please enter a valid 10-digit mobile number.');
      return;
    }

    let otherCriteria = '';
    if (formData.criteria === 'other') {
      const otherCriteriaElement = document.querySelector('input[name="other-criteria"]');
      console.log(otherCriteriaElement);
      if (otherCriteriaElement) {
        otherCriteria = otherCriteriaElement.value.trim();
        if (otherCriteria === '') {
          alert('Please enter a valid criteria for "Other".');
          return;
        }
      } else {
        console.error('Element with id "other-criteria" not found');
      }
    }

    let otherPandal = '';
    if (formData.pandalCode === 'other') {
      const otherPandalElement = document.querySelector('input[name="other-pandal"]');
      if (otherPandalElement) {
        otherPandal = otherPandalElement.value.trim();
        if (otherPandal === '') {
          alert('Please enter a valid pandal name for "Other".');
          return;
        }
      } else {
        console.error('Element with id "other-pandal" not found');
      }
    }

    const voteData = {
      name: formData.name,
      mobileNumber: formData.mobileNumber,
      criteria: formData.criteria === "other" ? otherCriteria : formData.criteria,
      pandalName: formData.pandalCode === "other" ? otherPandal : formData.pandalCode
    };

    console.log(voteData);

    try {
      const response = await fetch('/api/votes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(voteData)
      });
      
      if (response.ok) {
        alert('Vote submitted successfully!');
        // Reset form
        event.target.reset();
        // Hide other fields
        document.querySelector('input[name="other-criteria"]').classList.add('hidden');
        document.querySelector('input[name="other-pandal"]').classList.add('hidden');
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || 'Failed to submit vote. Please try again.'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again later.');
    }
  });
