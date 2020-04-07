import { put } from 'axios';
import createApp from 'ringcentral-chatbot/dist/apps';
import getData from './api/covid';
let county = 'nothing';
const handle = async (event) => {
    const covid = await getData();

    const { type, text, group, bot } = event;

    if (event.text !== undefined) {
        county = event.text;
    }
    console.log('TEXT FROM EVENT: ' + county);

    if (type === 'Message4Bot' && text === 'pong') {
        await bot.sendMessage(group.id, {
            attachments: [
                {
                    type: 'Card',
                    text: `Covid Cases for **${covid[0].county}**
                    : \n${covid
                        .map(
                            (data) =>
                                `Cases: **${data.cases}** - Date: **${data.date}**`
                        )
                        .join('\n\n')}`,
                    author_name: 'Author Name',

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
        put(
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
