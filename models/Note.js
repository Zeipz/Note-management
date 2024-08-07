module.exports = (sequelize, DataTypes) => {
  const Note = sequelize.define('Note', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  });

  Note.associate = function(models) {
    Note.belongsTo(models.Category);
    Note.belongsToMany(models.Tag, { through: 'NoteTags' });
  };

  return Note;
};