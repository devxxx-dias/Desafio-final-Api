const aws = require('aws-sdk');
require('aws-sdk/lib/maintenance_mode_message').suppress = true;

const endpoint = new aws.Endpoint(process.env.ENDPOINT_S3);

const s3 = new aws.S3({
    endpoint,
    credentials: {
        accessKeyId: process.env.BUCKET_KEY_ID,
        secretAccessKey: process.env.BUCKET_APP_KEY,
    },

});

const listarBucket = async (req, res) => {

    const arquivos = await s3.listObjects({
        Bucket: process.env.BUCKET_KEY_NAME
    }).promise()

    return res.status(200).json(arquivos.Contents)
}
const uploadImage = async (path, buffer, mimetype) => {
    const arquivo = await s3.upload({
        Bucket: process.env.BUCKET_KEY_NAME,
        Key: path,
        Body: buffer,
        ContentType: mimetype

    }).promise()

    return {
        url: `https://${process.env.BUCKET_KEY_NAME}.${process.env.ENDPOINT_S3}/${arquivo.Key}`,
        path: arquivo.Key,

    }
}

const deletarImagem = async (path) => {

    const arquivos = await s3.deleteObject({
        Bucket: process.env.BUCKET_KEY_NAME,
        Key: path,

    }).promise()
}

module.exports = {
    listarBucket,
    uploadImage,
    deletarImagem
}