


export function maskCep(value) {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .replace(/(-\d{3})\d+?$/, '$1')
}


export function maskMoney(value) {
    if (value) {

        const inputNumero = parseFloat(value.replace(/[^\d]/g, ''));
        const formatoMonetario = inputNumero.toLocaleString('pt-BR', {
            style: 'decimal',
            // currency: 'BRL',
        });
        return formatoMonetario;
    } else {
        return ''
    }
};


export function maskCreditCard(value) {
    // Remove todos os caracteres que não são dígitos
    let cleanedValue = value.replace(/\D/g, '');

    // Limita o valor a 16 dígitos
    if (cleanedValue.length > 16) {
        cleanedValue = cleanedValue.substring(0, 16);
    }

    // Formata o valor em blocos de 4 dígitos
    cleanedValue = cleanedValue.match(/.{1,4}/g)?.join(' ') || '';

    return cleanedValue;
}



export function maskMonthDate(value) {
    // Remove todos os caracteres que não são dígitos
    let cleanedValue = value.replace(/\D/g, '');

    // Limita o valor a 4 dígitos (MMYY)
    if (cleanedValue.length > 4) {
        cleanedValue = cleanedValue.substring(0, 4);
    }

    // Verifica se o mês é válido (entre 01 e 12)
    if (cleanedValue.length >= 2) {
        let month = parseInt(cleanedValue.substring(0, 2));
        if (month < 1) {
            month = '01';
        } else if (month > 12) {
            month = '12';
        }
        cleanedValue = month.toString().padStart(2, '0') + cleanedValue.substring(2);
    }

    // Adiciona a barra para o formato MM/YY
    if (cleanedValue.length > 2) {
        cleanedValue = cleanedValue.substring(0, 2) + '/' + cleanedValue.substring(2);
    }

    return cleanedValue;
}


export function maskCpf(value) {
    // Remove todos os caracteres que não são dígitos
    let cleanedValue = value.replace(/\D/g, '');

    // Limita o valor a 11 dígitos (CPF)
    if (cleanedValue.length > 11) {
        cleanedValue = cleanedValue.substring(0, 11);
    }

    // Adiciona os pontos e o traço conforme o formato de CPF
    cleanedValue = cleanedValue.replace(/(\d{3})(\d)/, '$1.$2');
    cleanedValue = cleanedValue.replace(/(\d{3})(\d)/, '$1.$2');
    cleanedValue = cleanedValue.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

    return cleanedValue;
}

export function maskCnpj(value) {
    // Remove todos os caracteres que não são dígitos
    let cleanedValue = value.replace(/\D/g, '');

    // Limita o valor a 14 dígitos (CNPJ)
    if (cleanedValue.length > 14) {
        cleanedValue = cleanedValue.substring(0, 14);
    }

    // Adiciona os pontos, a barra e o traço conforme o formato de CNPJ
    cleanedValue = cleanedValue.replace(/(\d{2})(\d)/, '$1.$2');
    cleanedValue = cleanedValue.replace(/(\d{3})(\d)/, '$1.$2');
    cleanedValue = cleanedValue.replace(/(\d{3})(\d)/, '$1/$2');
    cleanedValue = cleanedValue.replace(/(\d{4})(\d)/, '$1-$2');

    return cleanedValue;
}


export function formatDate(date) {

    const dateFormat = new Date(date)
    const day = String(dateFormat.getDate()).padStart(2, '0');
    const month = String(dateFormat.getMonth() + 1).padStart(2, '0'); // Mês em JavaScript começa em 0, por isso adicionamos 1
    const year = String(dateFormat.getFullYear()).slice(-2); // Pega apenas os dois últimos dígitos do ano

    return `${day}/${month}/${year}`;
}


export function maskNumberMoney(value) {
    if (value) {
        let BrlNumber = new Intl.NumberFormat("pt-BR", {
            style: "decimal",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })
        return BrlNumber.format(value);
    } else {
        return '';
    }
}


export function maskEmail(value) {
    return value
        .replace(/\s/g, '')
        .toLowerCase()
}