const districtList= [
    {
        "district_id": 301,
        "district_name": "Alappuzha",
        "key": 301
    },
    {
        "district_id": 307,
        "district_name": "Ernakulam",
        "key": 307
    },
    {
        "district_id": 306,
        "district_name": "Idukki",
        "key": 306
    },
    {
        "district_id": 297,
        "district_name": "Kannur",
        "key": 297
    },
    {
        "district_id": 295,
        "district_name": "Kasaragod",
        "key": 295
    },
    {
        "district_id": 298,
        "district_name": "Kollam",
        "key": 298
    },
    {
        "district_id": 304,
        "district_name": "Kottayam",
        "key": 304
    },
    {
        "district_id": 305,
        "district_name": "Kozhikode",
        "key": 305
    },
    {
        "district_id": 302,
        "district_name": "Malappuram",
        "key": 302
    },
    {
        "district_id": 308,
        "district_name": "Palakkad",
        "key": 308
    },
    {
        "district_id": 300,
        "district_name": "Pathanamthitta",
        "key": 300
    },
    {
        "district_id": 296,
        "district_name": "Thiruvananthapuram",
        "key": 296
    },
    {
        "district_id": 303,
        "district_name": "Thrissur",
        "key": 303
    },
    {
        "district_id": 299,
        "district_name": "Wayanad",
        "key": 299
    }
]

function getFormattedDateHelper(numberOfWeeks) {
    let todayTime = new Date();
    todayTime.setDate(todayTime.getDate() + (numberOfWeeks*7));
    let month = (todayTime.getMonth() + 1);
    let day = (todayTime.getDate());
    let year = (todayTime.getFullYear());
    return day + "-" + month + "-" + year;
  }

// 4. fetch availability details and send OTP if vaccine stock available
function fetchAvailabilityDetailsAndAlertUser(districtId,numberOfWeeks,phone) {

    //check vaccine availability for each week
    for(let week=0;week<numberOfWeeks;week++) {
        let startDate = getFormattedDateHelper(week);
        console.log(week);
        const endpoint = 'https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id='+districtId+'&date='+startDate;
        fetch(endpoint)
        .then(response => response.json())
        .then(function(response) {
            //used to optimise performance, ensuring that DOM will be updated only once for each week's data
            function buildOutputHelper(response,centerIndex,sessionIndex,output) {
                output=output+"<p>"+response["centers"][centerIndex]["name"]+" "+response["centers"][centerIndex]["sessions"][sessionIndex]["date"]+" "+response["centers"][centerIndex]["sessions"][sessionIndex]["available_capacity"]+"</p>";
                return output;
            }
            
            function attachToOutputHelper(output) {
                document.querySelector('#output-div').innerHTML=output;
            }
    
            function notifyViaOTP(phone) {
                let OTPRequestBody = {
                    mobile: phone
                }
                const endpoint = 'https://cdn-api.co-vin.in/api/v2/auth/public/generateOTP';
                fetch(endpoint, {
                    method: 'POST',
                    body: JSON.stringify(OTPRequestBody)
                  })
                  .then(function(response) {
                    if (!response.ok) {
                        alert(response.statusText+": OTP already sent");
                    }
                    console.log(response);
                })
    
            }
            
            if(response["centers"].length>0) {
                //No need to write custom logic to prevent multiple calls of this function(which will happen once per each week's data fetched), since API endpoint is configured to return status 400 for multiple calls in less than 3 minutes
                notifyViaOTP(phone);
                let output="<h3>Week "+(week+1)+"</h3>";
                for(let centerIndex=0;centerIndex<response["centers"].length;centerIndex++) {
                    for(let sessionIndex=0;sessionIndex<response["centers"][centerIndex]["sessions"].length;sessionIndex++) {
                        // if(response["centers"][centerIndex]["sessions"][sessionIndex]["available_capacity"]>0) {
                            output=buildOutputHelper(response,centerIndex,sessionIndex,output);
                        // }
                    }
                }
                attachToOutputHelper(output);
            }
        });
    }
}
// 1. populate districts select box using districtList data
let districts='';
districtList.forEach(district => {
  districts += '<option value='+district.district_id+'>'+ district.district_name + '</option>';
}); 
document.querySelector('#district-select').innerHTML = districts;

// 2. validate weeks input for -ve values
const weeks=document.querySelector('#weeks');
weeks.addEventListener('blur',function() {
    if(this.value<1) {
        alert("Please provide positive value for weeks");
        this.value=1;
    }
})

//3. When 'check availability' Button is clicked, call API to fetch vaccine availability
const checkAvlBtn=document.querySelector('#check-avl');
checkAvlBtn.addEventListener('click',function() {
    let districtId = document.querySelector('#district-select').value;
    let numberOfWeeks = document.querySelector('#weeks').value;
    let phone = document.querySelector('#phone').value;
    fetchAvailabilityDetailsAndAlertUser(districtId,numberOfWeeks,phone);
});