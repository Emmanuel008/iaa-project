module.exports = (sequelize, DataTypes) => {
    const AdmitingInfo = sequelize.define("admiting_info", {
      admit_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      patient_type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      height: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      weight: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      patient_status: {
        type: DataTypes.ENUM("admited", "released"),
        allowNull: true,
      },
      
    });
    return AdmitingInfo
};