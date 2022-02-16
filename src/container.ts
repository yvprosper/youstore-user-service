import { asValue, Lifetime, asClass,asFunction, InjectionMode, createContainer} from "awilix"
import {scopePerRequest} from "awilix-express"
import database from "./infra/database/mongoose"
import router from "./interface/http/router/routes"
import restServer from "./interface/http/server"
import Logger from "./interface/http/utils/logger"
import customerModel from "./infra/database/models/mongoose/customerModel"
import merchantModel from "./infra/database/models/mongoose/merchantModel"
import config from "config"
import CreateCustomer from "./usecases/customers/createCustomer"
import GetCustomer from "./usecases/customers/getCustomer"
import GetCustomers from "./usecases/customers/getCustomers"
import UpdateCustomer from "./usecases/customers/updateCustomer"
import DeleteCustomer from "./usecases/customers/deleteCustomer"
import UploadAvatar from "./usecases/customers/uploadAvatar"
import AuthenticateCustomer from "./usecases/auth/customers/authenticateCustomer"
import ChangeCustomerPassword from "./usecases/auth/customers/changePassword"
import CreateMerchant from "./usecases/merchants/createMerchant"
import GetMerchant from "./usecases/merchants/getMerchant"
import GetMerchants from "./usecases/merchants/getMerchants"
import UpdateMerchant from "./usecases/merchants/updateMerchant"
import DeleteMerchant from "./usecases/merchants/deleteMerchant"
import UploadPhoto from "./usecases/merchants/uploadPhoto"
import AuthenticateMerchant from "./usecases/auth/merchants/authenticateMerchant"
import ChangeMerchantPassword from "./usecases/auth/merchants/changePassword"
import CustomerRepository from "./infra/repository/customerRepository"
import MerchantRepository from "./infra/repository/merchantRepository"
import Messenger from "./infra/libs/rabbitmq"


const container = createContainer({
    injectionMode: InjectionMode.PROXY
})

container.register({
  currentUser: asValue({}), // User will be added from auth middleware...
});

container.register({
    containerMiddleware: asValue(scopePerRequest(container)),
   // models: asValue(models),
    database: asClass(database),
    //customerController: asClass(CustomerController)
    restServer: asClass(restServer),
    router: asFunction(router),
    logger: asValue(Logger),
    customerModel: asValue(customerModel),
    merchantModel: asValue(merchantModel),
    config: asValue(config),
    createCustomer: asClass(CreateCustomer),
    getCustomer: asClass(GetCustomer),
    getCustomers: asClass(GetCustomers),
    updateCustomer: asClass(UpdateCustomer),
    deleteCustomer: asClass(DeleteCustomer),
    uploadAvatar: asClass(UploadAvatar),
    authenticateCustomer: asClass(AuthenticateCustomer),
    changeCustomerPassword: asClass(ChangeCustomerPassword),
    createMerchant: asClass(CreateMerchant),
    getMerchant: asClass(GetMerchant),
    getMerchants: asClass(GetMerchants),
    updateMerchant: asClass(UpdateMerchant),
    deleteMerchant: asClass(DeleteMerchant),
    uploadPhoto: asClass(UploadPhoto),
    authenticateMerchant: asClass(AuthenticateMerchant),
    changeMerchantPassword: asClass(ChangeMerchantPassword),
    customerRepository: asClass(CustomerRepository),
    merchantRepository: asClass(MerchantRepository),
    messenger: asClass(Messenger)
    

})







// load all repositories
  container.loadModules(
    [
      [
        "infra/repository/*.ts",
        {
          lifetime: Lifetime.SCOPED,
          register: asClass,
        },
      ],
    ],
    {
      // we want all files to be registered in camelCase.
      formatName: "camelCase",
      resolverOptions: {},
      cwd: __dirname,
    }
  );


// load all usecases
container.loadModules(
    [
      [
        "usecases/**/*.ts",
        {
          lifetime: Lifetime.SCOPED,
          register: asClass,
        },
      ],
    ],
    {
      // we want all files to be registered in camelCase.
      formatName: "camelCase",
      resolverOptions: {},
      cwd: __dirname,
    }
  );


  
export default container