const nodemailer = require('nodemailer');
const qoa = require('qoa');
const clc = require('cli-color');
const bcrypt = require('bcrypt');
const db = require('quick.db');

function start() {
  console.clear()
    console.log(clc.redBright`
        Welcome on NodeJS Mail Sender
________________________________________________
  (1) Send Mail       │  Send mail to someone
  (2) Setup           │  Setup Application  
  (3) Change password │  Change your admin password
  (4) Support         │  Contact the support
    `)
    option()
}
start()

function option() {
  
  const interactive = {
    type: 'interactive',
    query: 'Select an option',
    handle: 'option',
    symbol: '>',
    menu: [
      '(1) Send mail',
      '(2) Setup',
      '(3) Change password',
      '(4) Support'
    ]
  };

  qoa.prompt([interactive]).then((rep) => {

    if(rep.option === "(1) Send mail") {
      
    }

  })
}