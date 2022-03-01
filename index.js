const nodemailer = require('nodemailer');
const qoa = require('qoa');
const clc = require('cli-color');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv').config({path: './data/config.env'});
const data = process.env;
const os = require('os');

function setEnvValue(key, value) {
  const ENV_VARS = fs.readFileSync("./data/config.env", "utf8").split(os.EOL);
  const target = ENV_VARS.indexOf(ENV_VARS.find((line) => {
      return line.match(new RegExp(key));
  }));
  ENV_VARS.splice(target, 1, `${key}=${value}`);
  fs.writeFileSync("./data/config.env", ENV_VARS.join(os.EOL));
}

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

function start() {
  if(data.CONFIG_SET_SESSION === "true") {
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
  if(data.CONFIG_SET_SESSION === "false") {
    setup_session();
    } else if(!data.CONFIG_SET_SESSION)
      console.log("Please check the files program.")
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
  
      if(rep.option === "(1) Setup session") {
        setup_session_set()
      } else if(rep.option === "(2) Support") {
        support();
      }
  
    })
  
}


function setup_session_set() {
  console.clear();
  console.log(clc.redBright(`All of your informations as been crypted, and not shared.`))
  console.log(clc.greenBright(`Please set your administrator session.`))
  const ps = [
    {
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

    // setEnvValue("CONFIG_SET_SESSION", true)
    console.clear()
    const mailSet = [
      {
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

      let mailString = mail.split('@').pop()

      setEnvHashValue("MAIL", mail, 10);
      setEnvHashValue("MAIL_PASSWORD", password, 10);

      if(mailString === "gmail.com") {
        setEnvValue("PORT", 465);
      } else {
        console.log(clc.greenBright("If you don't know what's the SFTP port of your mail, check on internet like this \"sftp port of YOUR_MAIL_COMPAGNY\""))
        let otherPort = [{
          type: 'input',
          query: "What's the SFTP port of your mail ?",
          handle: 'port'
        }]

        qoa.prompt(otherPort).then(async rep => {
          let port = rep.port;
          setEnvValue("PORT", port);
        })

      }
    })

  })
}