const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const axios = require('axios');

// Set up the serial port
const port = new SerialPort({
    path: 'COM6',
    baudRate: 9600
});

const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

console.log('Connected to Arduino');


// Add this at the top of your file
let lastNotificationTime = 0;
const COOLDOWN_PERIOD = 300000; // 5 minutes in milliseconds









async function checkArmStatus() {
  try {
      // const response = await axios.get('https://notification-service-ten.vercel.app/check-status'); // Replace with your endpoint
      // if (response.data.status === 'armed') {
          port.write("DISARM\n");
          console.log('System Armed');
      // } else {
      //     port.write("DISARM\n");
      //     console.log('System Disarmed');
      // }
  } catch (error) {
      console.error('Failed to check arm status:', error.message);
  }
}

// Run checkArmStatus every 30 seconds
setInterval(checkArmStatus, 30000);







parser.on('data', (data) => {
    const data1 = data.trim();
    console.log(data1);
   
    if(data1.toLowerCase().includes('object detected')){
        const currentTime = Date.now();
        
        // Check if cooldown period has passed
        if (currentTime - lastNotificationTime >= COOLDOWN_PERIOD) {
            console.log('Object detected - sending notification');
            
            const messageTime = new Date().toLocaleString();
            const message = `Security breach detected at ${messageTime}`;

            // axios.post('https://notification-service-ten.vercel.app/send-notification', {
            //     email: 'anish231003@gmail.com',
            //     phone: '9691319018',
            //     message: message,
            //     type: 'Critical'
            // }, {
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            //     timeout: 5000
            // })
            // .then(response => {
            //     if (response.data.success) {
            //         console.log('Notification sent successfully');
            //         lastNotificationTime = currentTime; // Update last notification time
            //     } else {
            //         console.error('Notification failed:', response.data.message);
            //     }
            // })
            // .catch(error => {
            //     if (error.response) {
            //         console.error('Server error:', error.response.data);
            //     } else if (error.request) {
            //         console.error('No response from server');
            //     } else {
            //         console.error('Request error:', error.message);
            //     }
            // });
           
            

        
        
          } else {
            console.log('Object detected but notification on cooldown');
        }
    }

  });