const changeOperator = (operatorName) => {
    if (operatorName === undefined) return 'BudgetEnergie';
    switch (operatorName) {
        case 'PitPoint':
            return 'Essent';
        case 'NL-EVB':
            return 'Engie';
        case 'Allego':
            return 'DVEP_Energie';
        case 'EV-Box':
            return 'Om_nieuwe_energie';
        case 'Community by Shell Recharge':
            return 'DVEP_Energie';
        case 'LastMileSolutions':
            return 'NLE';
        case 'Blue Current':
            return 'DVEP_Energie';
        case 'E-Flux':
            return 'Oxxio';
        case 'Abel&co':
            return 'LastMileSolutions';
        case 'Fastned':
            return 'Delta-timeScore';
        case 'Alfen':
            return 'LastMileSolutions';
        case 'Joulz\t':
            return 'Oxxio';
        case undefined:
            return 'Essent';
        case 'Allego - Groningen and Drenthe':
            return 'DVEP_Energie';
        case 'Shell Recharge':
            return 'DVEP_Energie';
        case 'Just Plugin':
            return 'LastMileSolutions';
        case 'Engie':
            return 'Engie';
        case 'ConnectNed':
            return 'Oxxio';
        case 'AVIA Netherlands':
            return 'NLE';
        default:
            return operatorName;
    }
};

module.exports = { changeOperator };
