document.addEventListener("DOMContentLoaded", function () {
    // ตัวแปรสำหรับที่อยู่ตามบัตรประชาชน
    const provinceSelect = document.getElementById("province");
    const districtSelect = document.getElementById("district");
    const subdistrictSelect = document.getElementById("subdistrict");
    const postalCodeSelect = document.getElementById("postal-code");

    // ตัวแปรสำหรับฟอร์มที่อยู่ปัจจุบัน
    const currentProvinceSelect = document.getElementById("current-province");
    const currentDistrictSelect = document.getElementById("current-district");
    const currentSubdistrictSelect = document.getElementById("current-subdistrict");
    const currentPostalCodeSelect = document.getElementById("current-postal-code");

    // ตัวแปรสำหรับฟอร์มที่อยู่บริษัท
    const companyProvinceSelect = document.getElementById("company-province");
    const companyDistrictSelect = document.getElementById("company-district");
    const companySubdistrictSelect = document.getElementById("company-subdistrict");
    const companyPostalCodeSelect = document.getElementById("company-postal-code");

    // ฟังก์ชันในการโหลดจังหวัด
function loadProvinces(provinceSelect, districtSelect, subdistrictSelect, postalCodeSelect) {
    fetch("https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province_with_amphure_tambon.json")
        .then((response) => response.json())
        .then((data) => {
            provinceSelect.innerHTML = ""; // เคลียร์ตัวเลือกก่อนหน้า

            // เพิ่มตัวเลือกเริ่มต้น "กรุณาเลือกจังหวัด"
            const defaultOption = document.createElement("option");
            defaultOption.value = ""; // กำหนดค่าให้ว่างเพื่อใช้สำหรับตรวจสอบการเลือก
            defaultOption.textContent = "กรุณาเลือกจังหวัด";
            provinceSelect.appendChild(defaultOption);

            // เพิ่มตัวเลือกของจังหวัดจากข้อมูลที่ดึงมา
            data.forEach((province) => {
                const option = document.createElement("option");
                option.value = province.id;
                option.textContent = province.name_th;
                provinceSelect.appendChild(option);
            });

            // ไม่ต้องตั้งค่า default ในที่นี้ เพราะเราตั้งค่าเป็น "กรุณาเลือกจังหวัด" อยู่แล้ว
        });
}

    // ฟังก์ชันในการโหลดอำเภอตามจังหวัดที่เลือก
function loadDistricts(provinceId, districtSelect, subdistrictSelect, postalCodeSelect) {
    fetch("https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province_with_amphure_tambon.json")
        .then((response) => response.json())
        .then((data) => {
            const province = data.find((p) => p.id === Number(provinceId));
            districtSelect.innerHTML = ""; // ล้างตัวเลือกก่อนหน้า
            subdistrictSelect.innerHTML = ""; // ล้างตำบล
            postalCodeSelect.innerHTML = ""; // เคลียร์รหัสไปรษณีย์เมื่อเปลี่ยนจังหวัด

            // เพิ่มตัวเลือกเริ่มต้น "กรุณาเลือก อำเภอ/เขต"
            const defaultOption = document.createElement("option");
            defaultOption.value = ""; // กำหนดค่าให้ว่างเพื่อใช้สำหรับตรวจสอบการเลือก
            defaultOption.textContent = "กรุณาเลือก อำเภอ/เขต";
            districtSelect.appendChild(defaultOption);

            if (province) {
                province.amphure.forEach((district) => {
                    const option = document.createElement("option");
                    option.value = district.id;
                    option.textContent = district.name_th;
                    districtSelect.appendChild(option);
                });

                // ไม่ตั้งค่าอำเภอเริ่มต้นเพื่อบังคับให้ผู้ใช้เลือก
            }
        });
}


    // ฟังก์ชันในการโหลดตำบลตามอำเภอที่เลือก
function loadSubdistricts(districtId, subdistrictSelect, postalCodeSelect) {
    fetch("https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province_with_amphure_tambon.json")
        .then((response) => response.json())
        .then((data) => {
            const district = data.flatMap(province => province.amphure).find((d) => d.id === Number(districtId));
            subdistrictSelect.innerHTML = ""; // ล้างตัวเลือกตำบล
            postalCodeSelect.innerHTML = ""; // เคลียร์รหัสไปรษณีย์เมื่อเปลี่ยนตำบล

            // เพิ่มตัวเลือกเริ่มต้น "กรุณาเลือก ตำบล/แขวง"
            const defaultOption = document.createElement("option");
            defaultOption.value = ""; // กำหนดค่าให้ว่างเพื่อใช้สำหรับตรวจสอบการเลือก
            defaultOption.textContent = "กรุณาเลือก ตำบล/แขวง";
            subdistrictSelect.appendChild(defaultOption);

            if (district) {
                district.tambon.forEach((subdistrict) => {
                    const option = document.createElement("option");
                    option.value = subdistrict.id;
                    option.textContent = subdistrict.name_th;
                    subdistrictSelect.appendChild(option);
                });

                // แสดงรหัสไปรษณีย์ของตำบลแรก
                if (district.tambon.length > 0) {
                    loadPostalCodes(district.tambon[0].id, postalCodeSelect); // โหลดรหัสไปรษณีย์ของตำบลแรก
                }
            }
        });
}


    // ฟังก์ชันในการดึงรหัสไปรษณีย์ตามตำบลที่เลือก
    function loadPostalCodes(subdistrictId, postalCodeSelect) {
        fetch("https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province_with_amphure_tambon.json")
            .then((response) => response.json())
            .then((data) => {
                const subdistricts = data.flatMap(province =>
                    province.amphure.flatMap(district =>
                        district.tambon));

                postalCodeSelect.innerHTML = ""; // เคลียร์รหัสไปรษณีย์

                const selectedSubdistrict = subdistricts.find(s => s.id === Number(subdistrictId));
                
                if (selectedSubdistrict) {
                    const postalCodeOption = document.createElement("option");
                    postalCodeOption.value = selectedSubdistrict.zip_code; // ใช้ zip_code จากข้อมูล
                    postalCodeOption.textContent = selectedSubdistrict.zip_code; // แสดงรหัสไปรษณีย์
                    postalCodeSelect.appendChild(postalCodeOption);
                } else {
                    postalCodeSelect.innerHTML = "<option value=''>ไม่มีรหัสไปรษณีย์</option>";
                }
            })
            .catch(error => {
                console.error("Error fetching postal codes:", error);
                postalCodeSelect.innerHTML = "<option value=''>ไม่สามารถโหลดรหัสไปรษณีย์</option>";
            });
    }

    // โหลดข้อมูลเริ่มต้นสำหรับที่อยู่ตามบัตรประชาชน
    loadProvinces(provinceSelect, districtSelect, subdistrictSelect, postalCodeSelect); 
    // โหลดข้อมูลเริ่มต้นสำหรับที่อยู่ปัจจุบัน
    loadProvinces(currentProvinceSelect, currentDistrictSelect, currentSubdistrictSelect, currentPostalCodeSelect); 
    // โหลดข้อมูลเริ่มต้นสำหรับที่อยู่บริษัท
    loadProvinces(companyProvinceSelect, companyDistrictSelect, companySubdistrictSelect, companyPostalCodeSelect); 

    // จัดการเหตุการณ์การเปลี่ยนแปลงจังหวัด
    provinceSelect.addEventListener("change", function () {
        loadDistricts(this.value, districtSelect, subdistrictSelect, postalCodeSelect);
    });
    currentProvinceSelect.addEventListener("change", function () {
        loadDistricts(this.value, currentDistrictSelect, currentSubdistrictSelect, currentPostalCodeSelect);
    });
    companyProvinceSelect.addEventListener("change", function () {
        loadDistricts(this.value, companyDistrictSelect, companySubdistrictSelect, companyPostalCodeSelect);
    });

    // จัดการเหตุการณ์การเปลี่ยนแปลงอำเภอ
    districtSelect.addEventListener("change", function () {
        loadSubdistricts(this.value, subdistrictSelect, postalCodeSelect);
        loadPostalCodes(this.value, postalCodeSelect); // โหลดรหัสไปรษณีย์เมื่อเลือกอำเภอ
    });
    currentDistrictSelect.addEventListener("change", function () {
        loadSubdistricts(this.value, currentSubdistrictSelect, currentPostalCodeSelect);
        loadPostalCodes(this.value, currentPostalCodeSelect); // โหลดรหัสไปรษณีย์เมื่อเลือกอำเภอ
    });
    companyDistrictSelect.addEventListener("change", function () {
        loadSubdistricts(this.value, companySubdistrictSelect, companyPostalCodeSelect);
        loadPostalCodes(this.value, companyPostalCodeSelect); // โหลดรหัสไปรษณีย์เมื่อเลือกอำเภอ
    });

    // จัดการเหตุการณ์การเปลี่ยนแปลงตำบล
    subdistrictSelect.addEventListener("change", function () {
        loadPostalCodes(this.value, postalCodeSelect);
    });
    currentSubdistrictSelect.addEventListener("change", function () {
        loadPostalCodes(this.value, currentPostalCodeSelect);
    });
    companySubdistrictSelect.addEventListener("change", function () {
        loadPostalCodes(this.value, companyPostalCodeSelect);
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const IDdocInput = document.getElementById("IDdoc");

    // Set unique ID and today's date on page load
    if (IDdocInput) {
        const uniqueId = generateUniqueId();
        IDdocInput.value = uniqueId;
        console.log('Unique ID:', uniqueId);
    } else {
        console.warn("IDdoc input field not found.");
    }

    const today = new Date();
    const dateInput = document.getElementById("date");
    const firstPaymentDateInput = document.getElementById("first-payment-date");

    if (dateInput) {
        dateInput.value = formatDateToThai(today);
    } else {
        console.warn("Date input field not found.");
    }

    if (firstPaymentDateInput) {
        firstPaymentDateInput.value = formatDateToThai(today);
    } else {
        console.warn("First payment date input field not found.");
    }



  document.querySelectorAll('.next-btn').forEach(button => {
    button.addEventListener('click', function () {
        const currentSection = this.parentElement;
        const currentTab = document.querySelector(`.tab[data-section="${currentSection.id}"]`);

        // Check validity of all fields in the current section
        const allValid = Array.from(currentSection.querySelectorAll('input, select')).every(field => field.checkValidity());

        if (!allValid) {
            // Show SweetAlert if fields in the current section are invalid
            Swal.fire({
                title: 'ข้อมูลไม่ครบ',
                text: 'กรุณากรอกข้อมูลให้ครบทุกช่องที่จำเป็น',
                icon: 'warning',
                confirmButtonText: 'ตกลง'
            });

            // Highlight invalid fields in the current section
            currentSection.querySelectorAll('input, select').forEach(field => field.reportValidity());
        } else {
            // Move to the next section and update the active tab
            const nextSection = currentSection.nextElementSibling;
            if (nextSection && nextSection.classList.contains('form-section')) {
                // Hide current section and show next section
                currentSection.classList.remove('active');
                nextSection.classList.add('active');

                // Update tabs: remove 'active' from the current tab and add it to the next tab
                currentTab.classList.remove('active');
                const nextTab = document.querySelector(`.tab[data-section="${nextSection.id}"]`);
                nextTab.classList.add('active');
            }
        }
    });
});



    document.querySelectorAll('.prev-btn').forEach(button => {
        button.addEventListener('click', function() {
            const currentSection = this.parentElement;
            const prevSection = currentSection.previousElementSibling;
            if (prevSection && prevSection.classList.contains('form-section')) {
                document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.form-section').forEach(section => section.classList.remove('active'));
                prevSection.classList.add('active');
                document.querySelector(`.tab[data-section="${prevSection.id}"]`).classList.add('active');
            }
        });
    });

    // Function to generate a unique ID
    function generateUniqueId() {
        return 'id-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    }

    // Function to format date to Thai format
    function formatDateToThai(date) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('th-TH', options);
    }
});



document.addEventListener('DOMContentLoaded', function () {
    // ฟังก์ชันเพื่อดึง userID จาก LINE LIFF
    function getUserIdFromLINE() {
        return new Promise((resolve, reject) => {
            liff.init({
                liffId: "2006703040-MdneWnen" // ใส่ LIFF ID ของคุณที่นี่
            }).then(() => {
                if (liff.isLoggedIn()) {
                    return liff.getProfile();
                } else {
                    liff.login();
                }
            }).then(profile => {
                resolve(profile.userId);
            }).catch(error => {
                reject(error);
            });
        });
    }

    // ฟังก์ชันเพื่อดึงข้อมูลจาก API
    async function fetchUserData(userID) {
        const response = await fetch(`https://script.google.com/macros/s/AKfycbz4TqjioAxe5pFZg29uhnu-FlbjbTEefmFzEMqTGOdTodm73Nf5c6kkAkdBexPfDLAs/exec?userID=${userID}`);
        const data = await response.json();
        return data;
    }

    function calculateAge(dob) {
    // แยกวัน เดือน ปีจากสตริงที่รับเข้ามา
    const parts = dob.split('/');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // เดือนเริ่มต้นที่ 0
    const year = parseInt(parts[2], 10) - 543; // แปลงปีพุทธศักราชเป็นปีคริสต์ศักราช

    // สร้างวันที่จากข้อมูลที่แยก
    const birthDate = new Date(year, month, day);
    
    // คำนวณอายุ
    const ageDiff = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDiff);
    return Math.abs(ageDate.getUTCFullYear() - 1970); // คำนวณอายุ
}

    // เมื่อโหลดหน้า
    getUserIdFromLINE().then(userID => {
        return fetchUserData(userID);
    }).then(userData => {
        // ถ้าข้อมูลถูกต้อง ให้นำข้อมูลไปกรอกในฟอร์ม
        if (!userData.error) {
            document.getElementById('userID').value = userData.userID;
            document.getElementById('fullname').value = userData.fullname;
            document.getElementById('dob').value = userData.dob;
            document.getElementById('id-card').value = userData.idCard;

            // คำนวณและแสดงอายุ
            const age = calculateAge(userData.dob);
            document.getElementById('age').value = age; // ตั้งค่าฟิลด์อายุ
        } else {
             window.location.href = 'index.html';
        }
    }).catch(error => {
        console.error(error);
    });
});
fetch('https://raw.githubusercontent.com/ok1developer/ok1/8446d0fa23f56c332cd68e4e052afbbefc8d8035/productData%20(1).json')
    .then(response => response.json())
    .then(data => {
        const productSelect = document.getElementById('product');
        const modelSelect = document.getElementById('model');
        const storageSelect = document.getElementById('storage');
        const colorSelect = document.getElementById('color');

        modelSelect.disabled = true;
        storageSelect.disabled = true;
        colorSelect.disabled = true;

        const productsMap = {};
        data.forEach(item => {
            if (!productsMap[item.สินค้า]) {
                productsMap[item.สินค้า] = [];
            }
            productsMap[item.สินค้า].push(item);
        });

        Object.keys(productsMap).forEach(product => {
            const option = document.createElement('option');
            option.value = product;
            option.textContent = product;
            productSelect.appendChild(option);
        });

        productSelect.addEventListener('change', (event) => {
            const selectedProduct = event.target.value;
            modelSelect.innerHTML = '<option value="">-- กรุณาเลือกรุ่น --</option>';
            storageSelect.innerHTML = '<option value="">-- กรุณาเลือกความจุ --</option>';
            colorSelect.innerHTML = '<option value="">-- กรุณาเลือกสี --</option>';
            modelSelect.disabled = true;
            storageSelect.disabled = true;
            colorSelect.disabled = true;

            if (selectedProduct) {
                const modelsSet = new Set();
                productsMap[selectedProduct].forEach(item => {
                    modelsSet.add(item.รุ่น);
                });

                modelsSet.forEach(model => {
                    const modelOption = document.createElement('option');
                    modelOption.value = model;
                    modelOption.textContent = model;
                    modelSelect.appendChild(modelOption);
                });

                modelSelect.disabled = false;
            }
        });

        modelSelect.addEventListener('change', (event) => {
            const selectedModel = event.target.value;
            storageSelect.innerHTML = '<option value="">-- กรุณาเลือกความจุ --</option>';
            colorSelect.innerHTML = '<option value="">-- กรุณาเลือกสี --</option>';
            storageSelect.disabled = true;
            colorSelect.disabled = true;

            if (selectedModel) {
                const selectedProduct = productSelect.value;
                const storageSet = new Set();
                const colorSet = new Set();

                productsMap[selectedProduct].forEach(item => {
                    if (item.รุ่น === selectedModel) {
                        storageSet.add(item.ความจุ);
                        colorSet.add(item.สี);
                    }
                });

                storageSet.forEach(storage => {
                    const storageOption = document.createElement('option');
                    storageOption.value = storage;
                    storageOption.textContent = storage;
                    storageSelect.appendChild(storageOption);
                });

                colorSet.forEach(color => {
                    const colorOption = document.createElement('option');
                    colorOption.value = color;
                    colorOption.textContent = color;
                    colorSelect.appendChild(colorOption);
                });

                storageSelect.disabled = false;
                colorSelect.disabled = false;
            }
        });
    })
    .catch(error => {
    console.error('Error fetching product data:', error);
    // alert('There was an error loading product data. Please try again later.');
});


const canvas = document.getElementById('signature');
const ctx = canvas.getContext('2d');
let drawing = false;

// Define scale factor for higher resolution
const scale = 2;

// Set maximum width for the canvas on larger screens
const maxWidth = 300;

// Calculate responsive dimensions based on screen size
const canvasWidth = Math.min(window.innerWidth, maxWidth);
const canvasHeight = canvasWidth / 2; // Maintain a 2:1 aspect ratio

// Apply scaled dimensions to canvas for high resolution
canvas.width = canvasWidth * scale;
canvas.height = canvasHeight * scale;
canvas.style.width = `${canvasWidth}px`; // Displayed width
canvas.style.height = `${canvasHeight}px`; // Displayed height

// Scale the drawing context to ensure sharpness
ctx.scale(scale, scale);

// Set line properties for a smoother signature
ctx.lineWidth = 2; // Adjust for desired thickness
ctx.lineCap = 'round'; // Rounded lines for smoother strokes
ctx.lineJoin = 'round'; // Smooths line joins

// Add event listeners and other drawing logic as usual



// Event listeners for touch and mouse events
canvas.addEventListener('touchstart', startDrawing);
canvas.addEventListener('touchmove', draw);
canvas.addEventListener('touchend', stopDrawing);

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseleave', stopDrawing);

// Disable scrolling when touch starts on the canvas
canvas.addEventListener('touchstart', function(event) {
    event.preventDefault();
});

// Disable scrolling when moving on the canvas
canvas.addEventListener('touchmove', function(event) {
    event.preventDefault();
});

// Function to start drawing
function startDrawing(event) {
    drawing = true;
    ctx.beginPath();
    const { offsetX, offsetY } = getMousePos(event);
    ctx.moveTo(offsetX, offsetY);
}

// Function to draw on the canvas
function draw(event) {
    if (!drawing) return;
    const { offsetX, offsetY } = getMousePos(event);
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
}

// Function to stop drawing
function stopDrawing() {
    drawing = false;
    ctx.closePath();
}

// Function to get mouse/touch position
function getMousePos(event) {
    let rect = canvas.getBoundingClientRect();
    if (event.touches) {
        return {
            offsetX: (event.touches[0].clientX - rect.left),
            offsetY: (event.touches[0].clientY - rect.top)
        };
    } else {
        return {
            offsetX: (event.clientX - rect.left),
            offsetY: (event.clientY - rect.top)
        };
    }
}

// Clear signature functionality
document.getElementById('clearSignature').addEventListener('click', function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});



function toggleCustomInput() {
    const selectElement = document.getElementById('name-title');
    const customInput = document.getElementById('name-title-custom');

    if (selectElement.value === 'อื่นๆ') {
        customInput.style.display = 'block'; // แสดง input
        customInput.required = true; // ตั้งค่าให้เป็นช่องกรอกข้อมูลที่จำเป็น
    } else {
        customInput.style.display = 'none'; // ซ่อน input
        customInput.value = ''; // เคลียร์ค่าที่กรอก
        customInput.required = false; // ไม่จำเป็นต้องกรอกข้อมูล
    }
}

function toggleReferenceInput() {
    const selectElement = document.getElementById('reference-relation');
    const customInput = document.getElementById('reference-relation-custom');

    if (selectElement.value === 'อื่นๆ') {
        customInput.style.display = 'block'; // แสดง input
        customInput.required = true; // ตั้งค่าให้เป็นช่องกรอกข้อมูลที่จำเป็น
    } else {
        customInput.style.display = 'none'; // ซ่อน input
        customInput.value = ''; // เคลียร์ค่าที่กรอก
        customInput.required = false; // ไม่จำเป็นต้องกรอกข้อมูล
    }
}

document.getElementById('refinance-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    const form = document.getElementById('refinance-form');

    // Check if all required fields are filled
    if (!form.checkValidity()) {
        // Display SweetAlert warning if there are missing fields
        Swal.fire({
            title: 'ข้อมูลไม่ครบ',
            text: 'กรุณากรอกข้อมูลให้ครบทุกช่องที่จำเป็น',
            icon: 'warning',
            confirmButtonText: 'ตกลง'
        });

        // Show the HTML built-in validation message for each invalid field
        form.reportValidity();
        return; // Stop the form from submitting if any field is invalid
    }

    // Show loading alert while submitting the form
   Swal.fire({
    html: `
        <img src="https://cdn.glitch.global/47bd20a5-ea68-4eee-b852-538d3eb2c0a4/1731150588669.gif?v=1731153414823" 
        alt="loading" width="300">
        <p style="margin-top: 20px; font-size: 16px; color: #ff3366;">กรุณาอย่าออกจากหน้านี้จนกว่าจะส่งข้อมูลสำเร็จ</p>
    `,
    allowOutsideClick: false,
    showConfirmButton: false
});


    // Call the function to send text data
    const isTextDataSuccess = await sendTextData();

    // If text data is sent successfully, proceed to send file data
    if (isTextDataSuccess) {
        await sendFileData();
    }
});


// ฟังก์ชันสำหรับส่งข้อมูลที่เป็นข้อความ
async function sendTextData() {
    const params = new URLSearchParams();
    const textFields = [
        'branch', 'IDdoc', 'date', 'name-title', 'name-title-custom', 'fullname', 'userID',
        'dob', 'age', 'id-card', 'b-id-card', 'house-number', 'moo', 'street', 'soi',
        'postal-code', 'phone', 'apple-id', 'apple-password', 'screen-password', 'facebook', 
        'line-id', 'company', 'company-address', 'company-postal-code', 'company-phone', 
        'current-address', 'current-postal-code', 'reference-name','reference-relation','reference-relation-custom', 'reference-phone', 
        'file-access-code', 'product', 'model', 'storage', 'color', 'imei', 
        'serial-number', 'quantity', 'refinance-price', 'installments', 
        'monthly-payment', 'first-payment-date', 'email'
    ];

    textFields.forEach(field => {
        params.append(field, document.getElementById(field).value);
    });

    // ดึงค่าข้อความจาก dropdown แทนที่จะใช้ ID
    const dropdownFields = ['province', 'district', 'subdistrict', 
        'company-province', 'company-district', 'company-subdistrict',
        'current-province', 'current-district', 'current-subdistrict'
    ];

    dropdownFields.forEach(field => {
        const selectElement = document.getElementById(field);
        const selectedText = selectElement.options[selectElement.selectedIndex].text;
        params.append(field, selectedText); // ส่งค่าข้อความที่แสดง
    });

    try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbypLIcoYNaYbdQWqiFUfYB0nhhGNqN0sPI10eyz1KMkhwLZyC4nESc4_t5JvebFIw3LSQ/exec', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params
        });

        const result = await response.json();
        if (result.status === 'success') {
            return true;
        } else {
            Swal.fire({
                title: 'เกิดข้อผิดพลาดในการส่งข้อความ',
                text: result.message,
                icon: 'error'
            });
            return false;
        }
    } catch (error) {
        Swal.fire({
            title: 'เกิดข้อผิดพลาดในการส่งข้อความ',
            text: error.message,
            icon: 'error'
        });
        return false;
    }
}
async function sendFileData() {
    const data = {
        IDdoc: document.getElementById('IDdoc').value // เพิ่ม IDdoc ลงในข้อมูล
    };
    const fileInputs = [
        'borrower-image',  'id-image', 'facebook-profile-image', 'salary-slip', 'bank-statement'
    ];

    // Convert each file input to Base64
    for (const inputId of fileInputs) {
        const file = document.getElementById(inputId).files[0];
        if (file) {
            const base64Data = await toBase64(file);
            data[inputId] = { 
                data: base64Data.split(',')[1], // Remove data type prefix
                type: file.type,
                name: file.name
            };
        }
    }

    // Check for signature
    const canvas = document.getElementById('signature');
    if (canvas) {
        const signatureDataUrl = canvas.toDataURL('image/png');
        data['signature'] = { 
            data: signatureDataUrl.split(',')[1], // เอาเฉพาะ Base64
            type: 'image/png',
            name: 'signature.png'
        };
    }

    try {
        await fetch('https://script.google.com/macros/s/AKfycbwG_Vm8VKk0Qs9f0VvW7u7T9dOKkWF0ljSrXMqF-WRIB1ghqJSnxmHlbjjp1chEdBKcVw/exec', {
            method: 'POST',
            mode: 'no-cors', // Use no-cors mode
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        Swal.fire({
                html: '<img src="https://cdn.glitch.global/47bd20a5-ea68-4eee-b852-538d3eb2c0a4/NO1Money8888.gif?v=1731154572535" alt="loading" width="300">',
                allowOutsideClick: true,
                confirmButtonText: 'OK'
            }).then(() => {
            window.location.href = 'member.html';
        });
    } catch (error) {
        Swal.fire({
            title: 'Error!',
            text: 'Error uploading files: ' + error.message,
            icon: 'error',
            confirmButtonText: 'Try Again'
        });
    }
}

function toBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}
function calculateMonthlyPayment() {
    const refinancePrice = parseFloat(document.getElementById('refinance-price').value);
    const installments = parseInt(document.getElementById('installments').value);
    
    // ถ้า refinancePrice = 4000 ให้บวก MDM เป็น 130 บาท ไม่เช่นนั้นให้เป็น 110 บาท
    let additionalMDM = 110;
    if (refinancePrice === 4000) {
        additionalMDM = 130;
    }

    // ตรวจสอบว่าค่าที่ได้รับมาถูกต้อง
    if (!isNaN(refinancePrice) && installments >= 3) {
        // คำนวณดอกเบี้ยรวม
        const totalInterest = refinancePrice * 0.165 * installments; 
        // ยอดรวมที่ต้องชำระ
        const totalAmount = refinancePrice + totalInterest; 
        // คำนวณค่างวดผ่อน
        let monthlyPayment = totalAmount / installments; 

        // เพิ่มค่าใช้จ่าย MDM ในแต่ละงวด
        monthlyPayment += additionalMDM; 

        // ปัดขึ้นเป็นหลักสิบทุกกรณี
        // แทนที่จะใช้ Math.round(...) ให้เปลี่ยนเป็น Math.ceil(...)
        monthlyPayment = Math.ceil(monthlyPayment / 10) * 10; 

        // แสดงผลใน input ของ monthly-payment
        document.getElementById('monthly-payment').value = monthlyPayment;
    } else {
        // ล้างค่าออกหากไม่ถูกต้อง
        document.getElementById('monthly-payment').value = ''; 
    }
}


// เพิ่ม event listener สำหรับการเปลี่ยนแปลงค่าใน refinance-price และ installments
document.getElementById('refinance-price').addEventListener('input', calculateMonthlyPayment);
document.getElementById('installments').addEventListener('change', calculateMonthlyPayment);

 document.getElementById("b-id-card").addEventListener("input", function() {
    let inputValue = this.value.replace(/[^A-Z0-9]/gi, "").toUpperCase(); // ทำให้เป็นตัวพิมพ์ใหญ่ทั้งหมด
    const errorMessage = document.getElementById("error-message");

    if (inputValue.length < 2) {
        this.setAttribute("inputmode", "text"); // ตัวแรกเป็นตัวอักษรภาษาอังกฤษ
    } else {
        this.setAttribute("inputmode", "numeric"); // ตั้งแต่ตัวที่ 2 เป็นต้นไปเป็นตัวเลข
    }

    this.value = inputValue.slice(0, 12); // จำกัดความยาวที่ 12 ตัว

    // ตรวจสอบความถูกต้องเมื่อครบ 12 หลัก
    if (inputValue.length === 12) {
        const idCardPattern = /^[A-Z]{2}\d{10}$/;
        if (idCardPattern.test(inputValue)) {
            const formattedId = `${inputValue.slice(0, 3)}-${inputValue.slice(3, 10)}-${inputValue.slice(10, 12)}`;
            this.value = formattedId;
            errorMessage.style.display = "none";
        } else {
            errorMessage.style.display = "inline";
        }
    } else {
        errorMessage.style.display = "none";
    }
});


function showPopup() {
    document.getElementById("popup").style.display = "block";
}

function closePopup() {
    document.getElementById("popup").style.display = "none";
}
function showSNPopup() {
    document.getElementById('sn-popup').style.display = 'block';
}

function closeSNPopup() {
    document.getElementById('sn-popup').style.display = 'none';
}
function showStoragePopup() {
    document.getElementById('storage-popup').style.display = 'block';
}

function closeStoragePopup() {
    document.getElementById('storage-popup').style.display = 'none';
}
function showUploadPopup() {
    document.getElementById('upload-popup').style.display = 'block';
}

function closeUploadPopup() {
    document.getElementById('upload-popup').style.display = 'none';
}
function showIDPopup() {
    document.getElementById('id-popup').style.display = 'block';
}

function closeIDPopup() {
    document.getElementById('id-popup').style.display = 'none';
}
 
document.addEventListener("DOMContentLoaded", () => {
    const checkbox = document.getElementById("checkBlock0");
    const form = document.getElementById("refinance-form");
    const tosContainer = document.querySelector(".tos-container");
    const acceptButton = document.querySelector(".accept-button-re");

    // เมื่อคลิก Checkbox
    checkbox.addEventListener("change", () => {
        if (checkbox.checked) {
            // ซ่อนฟอร์มและแสดง TOS Container
            form.style.display = "none";
            tosContainer.style.display = "block";
        }
    });

    // เมื่อคลิกปุ่ม "ยอมรับ"
    acceptButton.addEventListener("click", () => {
        // ซ่อน TOS Container และแสดงฟอร์ม
        tosContainer.style.display = "none";
        form.style.display = "block";
    });
});

// ตั้งค่าภาษาไทยด้วย Day.js
dayjs.extend(window.dayjs_plugin_customParseFormat);
dayjs.locale('th');

// ฟังก์ชันแปลงวันที่ไทยที่มีปีเป็น พ.ศ. ให้เป็น ISO (ปี ค.ศ.)
function parseThaiDateToISO(thaiDate) {
    const thaiFormat = "D MMMM BBBB";
    const parsedDate = dayjs(thaiDate, thaiFormat, 'th');

    if (!parsedDate.isValid()) {
        return null;
    }

    // ลบ 543 ปีเพื่อแปลงเป็นปี ค.ศ.
    const yearCE = parsedDate.year() + 543;
    return parsedDate.year(yearCE).format("YYYY-MM-DD");
}

// ฟังก์ชันแปลงวันที่ ISO (ปี ค.ศ.) กลับเป็นรูปแบบ พ.ศ.
function convertToThaiDate(isoDate) {
    const date = dayjs(isoDate);
    const yearBE = date.year() + 543; // เพิ่ม 543 ปีเพื่อให้เป็น พ.ศ.
    return date.year(yearBE).format("D MMMM BBBB");
}

document.addEventListener('DOMContentLoaded', function () {
    const contractDateStr = document.getElementById('date').value;

    const contractDateISO = parseThaiDateToISO(contractDateStr);

    if (!contractDateISO) {
        return;
    }

    // แปลงวันที่จาก ISO เป็นรูปแบบ 15-11-2567
    const defaultDate = dayjs(contractDateISO).add(0, 'day').format("DD-MM-YYYY");

    // ตั้งค่าค่าเริ่มต้นให้กับ input
    document.getElementById('first-payment-date').value = defaultDate;

    // ใช้ Flatpickr พร้อมภาษาไทย
    flatpickr("#first-payment-date", {
        minDate: dayjs(contractDateISO).add(0, 'day').format("YYYY-MM-DD"),
        maxDate: dayjs(contractDateISO).add(29, 'day').format("YYYY-MM-DD"),
        disableMobile: true,
        dateFormat: "d-m-Y", // รูปแบบวันที่ในปฏิทิน
        locale: "th", // ใช้ภาษาไทย
    });
});

function getLastTwoMonths() {
  const months = [
    'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
    'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
  ];

  const currentDate = new Date();
  const lastMonth = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
  const twoMonthsAgo = new Date(currentDate.setMonth(currentDate.getMonth() - 1));

  const lastMonthName = months[lastMonth.getMonth()];
  const twoMonthsAgoName = months[twoMonthsAgo.getMonth()];

  return `${twoMonthsAgoName}-${lastMonthName}`;
}

function updateLabels() {
  const lastTwoMonths = getLastTwoMonths();
  document.getElementById('salary-slip-label').innerHTML = `สลิปเงินเดือน<br>(${lastTwoMonths}):`;
  document.getElementById('bank-statement-label').innerHTML = `Statement<br>(${lastTwoMonths})<br><a href="statement.html" target="_blank">วิธีขอรายการเดินบัญชี</a>:`;
}


window.onload = updateLabels;


