'use strict'

import {fetchAvailabilityDetailsAndAlertUser} from './api-calls.js';

const districtList = [
  {
    district_id: 301,
    district_name: 'Alappuzha',
    key: 301
  },
  {
    district_id: 307,
    district_name: 'Ernakulam',
    key: 307
  },
  {
    district_id: 306,
    district_name: 'Idukki',
    key: 306
  },
  {
    district_id: 297,
    district_name: 'Kannur',
    key: 297
  },
  {
    district_id: 295,
    district_name: 'Kasaragod',
    key: 295
  },
  {
    district_id: 298,
    district_name: 'Kollam',
    key: 298
  },
  {
    district_id: 304,
    district_name: 'Kottayam',
    key: 304
  },
  {
    district_id: 305,
    district_name: 'Kozhikode',
    key: 305
  },
  {
    district_id: 302,
    district_name: 'Malappuram',
    key: 302
  },
  {
    district_id: 308,
    district_name: 'Palakkad',
    key: 308
  },
  {
    district_id: 300,
    district_name: 'Pathanamthitta',
    key: 300
  },
  {
    district_id: 296,
    district_name: 'Thiruvananthapuram',
    key: 296
  },
  {
    district_id: 303,
    district_name: 'Thrissur',
    key: 303
  },
  {
    district_id: 299,
    district_name: 'Wayanad',
    key: 299
  }
]

function getFormattedDateHelper(inputDay) {
  let todayTime = new Date();
  todayTime.setDate(todayTime.getDate() + inputDay);
  let month = (todayTime.getMonth() + 1);
  let day = (todayTime.getDate());
  let year = (todayTime.getFullYear());
  return day + '-' + month + '-' + year;
}

// 1. populate districts select box using districtList data
let districts = '';
districtList.forEach(district => {
  districts += '<option value=' + district.district_id + '>' + district.district_name + '</option>';
});
document.querySelector('#district-select').innerHTML = districts;

// 2. validate weeks input for -ve values
const weeks = document.querySelector('#weeks');
weeks.addEventListener('blur', function () {
  if (this.value < 1) {
    alert('Please provide positive value for weeks');
    this.value = 1;
  }
})

// 3. When 'check availability' Button is clicked, call API to fetch vaccine availability
const checkAvlBtn = document.querySelector('#check-avl');
checkAvlBtn.addEventListener('click', function () {
  let districtId = document.querySelector('#district-select').value;
  let numberOfWeeks = document.querySelector('#weeks').value;
  let phone = document.querySelector('#phone').value;
  fetchAvailabilityDetailsAndAlertUser(districtId, numberOfWeeks, phone);
});

