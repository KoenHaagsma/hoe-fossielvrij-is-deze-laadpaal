const changeOperator = (operatorName) => {
    switch (operatorName) {
        case 'PitPoint':
            return 'Engie';
        case '':
            break;
        default:
            return operatorName;
    }
};

module.exports = { changeOperator };
