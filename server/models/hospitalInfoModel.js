module.exports = (sequelize, DataTypes) => {
    const HospitalInfo = sequelize.define("hospital_info", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      hospital_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      question: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      answer: {
        type: DataTypes.ENUM("yes", "no"),
        allowNull: true,
      },
    });
    return HospitalInfo
}