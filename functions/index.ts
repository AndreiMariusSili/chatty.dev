
import * as functions from 'firebase-functions';
let translate = require('@google-cloud/translate')();

export let translateMesages = functions.database.ref('messages/{id}').onWrite(async event => {
    let snap = event.data;
    console.log(snap.val());
    console.log(snap.ref.key);
    let [langs] = await translate.getLanguages();

    console.log(langs);

    let work = langs.map(async lang => {
        let [translation] = await translate.translate(snap.val().text, lang.code);

        let location = "translations/" + lang.code + "/" + snap.ref.key;
        let data = {
            text: translation,
            name: snap.val().name,
            photoUrl: snap.val().photoUrl
        };
        snap.ref.root.child(location).set(data);
    });

    return Promise.all(work);
});