import { exec } from "child_process";
import { QuickDB } from "quick.db"
import { Track } from "../@types/interfaces";

const radio_global_db = new QuickDB({ table: "user", filePath: "./db/radio_global_db.sqlite" })

async function createRadio(radio: Track) {
    const check = await checkStream(radio.url)
    if (check) {
       radio_global_db.push("global", radio)
    }
}

async function getRadios() {
    return await radio_global_db.get('global')
}

function checkStream(url: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
        // Escape a URL para evitar problemas com caracteres especiais
        const escapedUrl = url.replace(/"/g, '\\"');
        const command = `ffmpeg -i "${escapedUrl}" -t 5 -f null -`;
        exec(command, (error, stdout, stderr) => {
            if (error) {
                //console.error(`Erro ao executar ffmpeg: ${error.message}`);
                return resolve(false); // Resolve false com reject
            }

            if (stderr.includes('Metadata')) {
                return resolve(true);
            } else {
                return resolve(false); // Resolve false com resolve
            }
        });
    });
}

export const RadioDb = {createRadio, getRadios}
