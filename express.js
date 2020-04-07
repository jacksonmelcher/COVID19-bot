const axios = require('axios');
const createApp = require('ringcentral-chatbot/dist/apps').default;
const getData = require('./api/covid');
// const url = require('./assets/jackson.png');

const handle = async (event) => {
    const covid = await getData();
    console.log(typeof covid);

    // console.log(`Cases: ${cases} and COunty: ${county}`);

    const { type, text, group, bot } = event;
    // console.log(`TEXT: ${event.text}`);

    if (type === 'Message4Bot' && text === 'ping') {
        // for (let i = 0; i < covid.length; i++) {
        await bot.sendMessage(group.id, {
            // text: 'Body of the post',
            // attachments: [
            //     {
            //         type: 'Card',
            //         fallback: 'Attachment fallback text',
            //         color: '#00ff2a',
            //         intro:
            //             'Attachment intro appears before the attachment block',
            //         author: {
            //             name: 'Author Name',
            //             uri: 'https://example.com/author_link',
            //             iconUri: url,
            //         },
            //         title: 'Attachment Title',
            //         text: 'Attachment text',
            //         imageUri: 'https://example.com/congrats.gif',
            //         thumbnailUri: 'https://example.com/thumbnail_icon.png',

            //         footnote: {
            //             text: 'Attachment footer and timestamp',
            //             iconUri: 'https://example.com/footer_icon.png',
            //             time: '2018-01-05T18:52:35.993311508-08:00',
            //         },
            //     },
            // ],
            attachments: [
                {
                    type: 'Card',
                    text: `Covid Cases for **${
                        covid[0].county
                    }**: \n${covid
                        .map(
                            (data) =>
                                `Cases: **${data.cases}** - Date: **${data.date}**`
                        )
                        .join('\n\n')}`,
                    author_name: 'Author Name',
                    author_link: 'https://example.com/author_link',
                    author_icon: 'https://example.com/author_icon.png',
                    // author_name: 'jackson1',
                    // author_icon: '../assets/jackson.png',

                    footnote: {
                        text:
                            'This bot was made by Jackson Melcher, the code can be found [here](https://github.com/jacksonmelcher/COVID19-bot)',
                    },
                },
            ],
        });
    }
};

const app = createApp(handle);
app.listen(process.env.RINGCENTRAL_CHATBOT_EXPRESS_PORT);

setInterval(
    async () =>
        axios.put(
            `${process.env.RINGCENTRAL_CHATBOT_SERVER}/admin/maintain`,
            undefined,
            {
                auth: {
                    username: process.env.RINGCENTRAL_CHATBOT_ADMIN_USERNAME,
                    password: process.env.RINGCENTRAL_CHATBOT_ADMIN_PASSWORD,
                },
            }
        ),
    24 * 60 * 60 * 1000
);
