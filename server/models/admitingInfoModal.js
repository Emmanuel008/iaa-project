module.exports = (sequelize, DataTypes) => {
    const AdmitingInfo = sequelize.define("admiting_info", {
      admit_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      patient_type: {
        type: DataTypes.ENUM(
          "6 - 23 months",
          "24 - 59 months",
          "5 - 9 years",
          "10 - 15 years",
          "15+ years",
          "preganant women",
          "post partum women"
        ),
        allowNull: false,
      },
      height: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      weight: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      admiting_status: {
        type: DataTypes.ENUM("admited", "released"),
        allowNull: false,
      },
    });
    return AdmitingInfo
};