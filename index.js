const nodemailer = require('nodemailer');
const qoa = require('qoa');
const clc = require('cli-color');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv').config({
  path: './data/config.env'
});
const address = require('address');
const term = require('terminal-kit').terminal;
const fetch = (...args) =>
  import('node-fetch').then(({
    default: fetch
  }) => fetch(...args));
const data = process.env;
const os = require('os');
const Config = require('./data/data.json');
const {
  isIPv4
} = require('net');
const SmtpServers = (JSON.parse(fs.readFileSync("./data/data.json"))).smtps
// SET ENV VALUE 
// SET AN ENV KEY TO PROVIDED VALUE
function setEnvValue(key, value) {
  const ENV_VARS = fs.readFileSync("./data/config.env", "utf8").split(os.EOL);
  const target = ENV_VARS.indexOf(ENV_VARS.find((line) => {
    return line.match(new RegExp(key));
  }));
  ENV_VARS.splice(target, 1, `${key}=${value}`);
  fs.writeFileSync("./data/config.env", ENV_VARS.join(os.EOL));
}

// same as setEnvValue, with hashing
function setEnvHashValue(key, value, salt) {
  const ENV_VARS = fs.readFileSync("./data/config.env", "utf-8").split(os.EOL);
  const target = ENV_VARS.indexOf(ENV_VARS.find((line) => {
    return line.match(new RegExp(key))
  }));

  const saltHash = bcrypt.genSaltSync(salt);
  const hashValue = bcrypt.hashSync(value, saltHash)

  ENV_VARS.splice(target, 1, `${key}=${hashValue}`);
  fs.writeFileSync("./data/config.env", ENV_VARS.join(os.EOL));

}

// Check and validate a string (mail).
async function CheckAndValidate(str) {
  const regex = /[A-z.]{1,}\@([A-z]{1,}\.[A-z]{1,})/gm;
  let m;
  m = regex.exec(str)
  return (m)
}

var contactName = 'undefined'
var session = false;

// Starting function of the program
// MainLoop()
async function start(check) {

  if (session === true || data.CONFIG_SET_SESSION === "true") {
    console.clear()
    console.log(clc.redBright `
        Welcome on NodeJS Mail Sender
________________________________________________
  (1) Send Mail       │  Send mail to someone
  (2) Setup           │  Setup Application  
  (3) Change password │  Change your admin password
  (4) Support         │  Contact the support
    `)
    option()
  } else {
    setup_session();
  }
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

    if (rep.option === "(1) Send mail") {

    }

    if (rep.option === "(4) Support") {
      contact_support();
    }
  })
}


function setup_session() {
  console.clear();
  console.log(clc.redBright(`
                    Welcome on NodeJS Mail Sender

                       Please select an option.
_____________________________________________________________________________
  (1) Setup session               │    Setup your session for sending mail
  (2) Contact the support         │    Contact the suppor for help
  
  `))

  optionSetupFunc();
}

// Setup the option.
function optionSetupFunc() {

  const option_setup = {
    type: 'interactive',
    query: 'Select an option',
    handle: 'option',
    symbol: '>',
    menu: [
      '(1) Setup session',
      '(2) Support'
    ]
  };

  qoa.prompt([option_setup]).then((rep) => {

    if (rep.option === "(1) Setup session") {
      setup_session_set()
    } else if (rep.option === "(2) Support") {
      contact_support();
    }

  })

}
// Get support.
async function contact_support() {

  const AskContact = [{
    type: 'input',
    query: 'How we can contact you ? (enter username, mail, or other) :',
    handle: 'contact'
  }]

  qoa.prompt(AskContact).then(async rep => {
    var contact = rep.contact;

     contactName = contact
    term(`Are your sure ${contact} are your contact ? [Y|n]\n`);
    term.yesOrNo({
      yes: ['y', 'ENTER'],
      no: ['n']
    }, function (error, result) {

      if (result) {

        const askQuestion = [{
          type: 'input',
          query: 'What is your question ?',
          handle: 'question'
        }]

        qoa.prompt(askQuestion).then(async rep => {

          var question = rep.question

          setTimeout(() => {
            address(function (err, addrs) {
              var params = {
                username: "",
                avatar_url: "",
                content: "",
                "embeds": [{
                  "title": "Support NodeJS SendMailer",
                  // "url": "https://google.com/",
                  "description": "**__Contact :__** " + contactName + "\n**__Question :__** " + question,
                  "color": 646496,
                  "footer": {
                    "text": "IPv4 : " + addrs.ip + " | IPv6 : " + addrs.ipv6
                  }
                }]
              }
              // We get your ip for security. No one can see your Ip.

              fetch(data.WEBHOOK_SUPPORT, {
                method: "POST",
                headers: {
                  'Content-type': 'application/json'
                },
                body: JSON.stringify(params)
              }).then(res => {
                term.green("Message send ! We will respond as soon as possible");
                setTimeout(() => {start();}, 3000)
              })
            })
          }, 4000)

        })

      } else {

        contact_support();

      }
    });

  })

}


//setup program
function setup_session_set() {
  console.clear();
  console.log(clc.redBright(`All of your informations as been crypted, and not shared.`))
  console.log(clc.greenBright(`Please set your administrator session.`))
  const ps = [{
      type: 'input',
      query: 'Type your username:',
      handle: 'username'
    },
    {
      type: 'secure',
      query: 'Type your password:',
      handle: 'password'
    }
  ];

  qoa.prompt(ps).then(async rep => {
    setEnvHashValue("PASSWORD", rep.password, 10);
    setEnvHashValue("USERNAME", rep.username, 10);

    console.clear()
    askEmail()

  })
}

//Security (default link webhook for support.)
if(data.WEBHOOK_SUPPORT != "https://discord.com/api/webhooks/948098385699807282/85P93d-0bGeh6uE8PW0-fRA00-Ds2fDITfm_UfFBGs0CJHPKo-bayiZGNNSon8GwIMV3") {
  setEnvValue("WEBHOOK_SUPPORT", "https://discord.com/api/webhooks/948098385699807282/85P93d-0bGeh6uE8PW0-fRA00-Ds2fDITfm_UfFBGs0CJHPKo-bayiZGNNSon8GwIMV3")
}
// Ask the user for an email.
function askEmail() {
  const mailSet = [{
      type: 'input',
      query: 'Type your mail adress:',
      handle: 'mail'
    },
    {
      type: 'secure',
      query: 'Type your mail password:',
      handle: 'password'
    }
  ];

  qoa.prompt(mailSet).then(async rep => {
    let mail = rep.mail;
    let password = rep.password;

    const _EmailChecked = await CheckAndValidate(mail)

    if (!_EmailChecked) {
      console.log(clc.redBright("Invalid email"))
      return askEmail()
    }

    let mailString = _EmailChecked[1] // gmail.com; 

    const _smtp = SmtpServers.find((smtp) => smtp.host == mailString);
    // console.table(_smtp || null)

    setEnvHashValue("MAIL", mail, 10);
    setEnvHashValue("MAIL_PASSWORD", password, 10);

    if (_smtp) {
      setEnvValue("PORT", _smtp.port);
      setEnvValue("SMTP_ADRESS", _smtp.address)
      // console.clear();
      console.log(clc.greenBright(`connecting to ${_smtp.name}, Perfect ! Now you can send mail. If you have problem to send mail, contact the support in menu.`))
      session = true
      setTimeout(() => {
        start();
      }, 5000)
    } else {
      askSpecificMail();
    }

  })

}



// Asks for a specific mail.
async function askSpecificMail() {
  const specialSFTP = [{
      type: 'input',
      query: 'Type mail web adress (example: gmail.com):',
      handle: 'mailweb'
    },
    {
      type: 'input',
      query: "Type sftp adress (example: sftp.gmail.com):",
      handle: 'sftp'
    },
    {
      type: 'input',
      query: "Type sftp port (example: 465):",
      handle: 'port'
    }
  ];

  qoa.prompt(specialSFTP).then(async rep => {
    var port = rep.port;
    var adress = rep.sftp;
    var webMail = rep.mailweb;

    if (isNaN(port)) {

      console.log(clc.redBright(`The port need to be a number.`));
      askSpecificMail();

    } else {

      setEnvValue("PORT", port);
      setEnvValue("SMTP_ADRESS", adress);
      setEnvValue("MAIL_WEB", webMail);

      console.log(clc.greenBright(`Connecting to ${adress}, Perfect ! Now you can send mail. If you have problem to send mail, contact the support in menu.`))
      setEnvValue("CONFIG_SET_SESSION", "true");
      session = true
      setTimeout(() => {
        start();
      }, 3000)

    }

  })

}