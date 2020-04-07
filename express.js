const axios = require('axios');
const createApp = require('ringcentral-chatbot/dist/apps').default;
const getData = require('./api/covid');

const handle = async (event) => {
    const covid = await getData();
    console.log(covid);
    const { cases, county } = covid[1];
    console.log(`Cases: ${cases} and COunty: ${county}`);
    const { type, text, group, bot } = event;
    if (type === 'Message4Bot' && text === 'ping') {
        await bot.sendMessage(group.id, {
            text: `Cases: ${cases} and County: ${county}`,
            // text: 'ping',
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
