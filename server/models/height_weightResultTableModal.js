module.exports = (sequelize, DataTypes) => {
  const HeightWeight = sequelize.define(
    "height_weight",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false },
      gender: {
        type: DataTypes.ENUM("male", "female"),
        allowNull: false,
      },
      height: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      neg3sd: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      neg2sd: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      neg1sd: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      sd0: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      sd1: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      sd2: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      sd3: { type: DataTypes.FLOAT, allowNull: false },
    },
    {
      timestamps: false,
    }
  );

  return HeightWeight;
};
