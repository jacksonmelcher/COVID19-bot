import { put } from 'axios';
import createApp from 'ringcentral-chatbot/dist/apps';
import getData from './api/covid';

// const about = () => {
//     return {
//         text:
//             'I am a Glip COVID 19 bot, I am created by ![:Person](850957020). Here is [my source code](https://github.com/jacksonmelcher/COVID19-bot).',
//     };
// };

let county = 'nothing';
const handle = async (event) => {
    let covid = [];
    const { type, text, group, bot } = event;

    covid = await getData('Washoe');
    // console.log('TEXT FROM EVENT: ' + covid.data);

    if (type === 'Message4Bot' && text === 'pong') {
        await bot.sendMessage(group.id, {
            attachments: [
                {
                    type: 'Card',
                    text: `Covid Cases for **${
                        covid[0].county
                    }**: \n ${covid
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
    // if (type === 'GroupJoined') {
    //     await bot.sendMessage(group.id, about());
    // }
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
