const changeOperator = (operatorName) => {
    if (operatorName === undefined) return 'BudgetEnergie';
    switch (operatorName) {
        case 'PitPoint':
            return 'Essent';
        case 'NL-EVB':
            return 'Engie';
        case 'Allego':
            return 'PureEnergie';
        default:
            return operatorName;
    }
};

module.exports = { changeOperator };
