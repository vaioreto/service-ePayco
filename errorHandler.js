'use stric'

function errorHandler(error) {
    console.log('log error ==>>>',error);

    if (error == 'Error: Email no disponible') {
        var e = new Error('Email no disponible');
        throw e;
    } else {
        var e = new Error('Comuniquese con un administrador del sistema para reportar esta Falla');
        throw e;
    }


}

module.exports = errorHandler