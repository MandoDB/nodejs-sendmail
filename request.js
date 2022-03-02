const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));

var params = {
    username: contactName || data.CONTACT  || "undefinedContact",
    avatar_url: "",
    content: "Some message you want to send",
    embeds: [
        {
            "title": "Some title",
            "color": 15258703,
            "thumbnail": {
                "url": "",
            },
            "fields": [
                {
                    "name": "Your fields here",
                    "value": "Whatever you wish to send",
                    "inline": true
                }
            ]
        }
    ]
}

fetch('https://discord.com/api/webhooks/948098385699807282/85P93d-0bGeh6uE8PW0-fRA00-Ds2fDITfm_UfFBGs0CJHPKo-bayiZGNNSon8GwIMV3', {
    method: "POST",
    headers: {
        'Content-type': 'application/json'
    },
    body: JSON.stringify(params)
}).then(res => {
    console.log(res);
}) 