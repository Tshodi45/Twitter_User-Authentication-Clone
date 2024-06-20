const { DataTypes, Model} = jest.requireActual('sequelize');

export default {
    Model,
    DataTypes,
    define: jest.fn(),
    authentication: jest.fn(),
};