module.exports = (sequelize, DataTypes) => {
  const Hospital = sequelize.define("hospital", {
    hospital_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    hospital_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    hospital_district: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    hospital_region: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  return Hospital;
};
