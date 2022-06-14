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
        case 'PZEM':
            return 'NLE';
        case 'Blue Current':
            return 'DVEP_Energie';
        case 'E-Flux':
            return 'Oxxio';
        case 'Abel&co':
            return 'PZEM';
        case 'Fastned':
            return 'Delta';
        case 'Alfen':
            return 'Essent';
        case 'Joulz\t':
            return 'Oxxio';
        case undefined:
            return 'Essent';
        case 'Allego - Groningen and Drenthe':
            return 'EasyEnergy';
        case 'Allego - Overijssel and Gelderland':
            return 'Oxxio';
        case 'Shell Recharge':
            return 'DVEP_Energie';
        case 'Just Plugin':
            return 'PZEM';
        case 'Engie':
            return 'Engie';
        case 'ConnectNed':
            return 'Oxxio';
        case 'AVIA Netherlands':
            return 'NLE';
        case 'Delta-timeScore':
            return 'EasyEnergy';
        case 'LastMileSolutions':
            return 'Engie';
        case 'EVnetNL':
            return 'Oxxio';
        case 'Awesems':
            return 'Oxxio';
        default:
            return operatorName;
    }
};

module.exports = { changeOperator };
