"use strict";
const role = {
  client: "7f42c6c5-4d1d-4d7a-b98d-4fbde547aea3",
  admin: "a3475cfe-dd08-4c7f-b17a-21600da615fc",
  superAdmin: "6c97252c-4135-4bf5-bd21-de2aff5f30a0",
};
exports.queryList = {
  //                                             ACCUNT
  GET_ACCOUNT_BY_EMAIL: `SELECT user_id FROM account WHERE email = $1`,
  CREATE_ACCOUNT: `WITH inserted AS (
              INSERT INTO  account(first_name ,last_name ,password ,email , phone_number ,role_id ,created_at)
              VALUES($1,$2,$3,$4,$5,'${role.client}',CURRENT_TIMESTAMP) 
              RETURNING   user_id, first_name, last_name,role_id )
                SELECT inserted.user_id,inserted.first_name,inserted.last_name, role.name as role FROM inserted 
                INNER JOIN role ON inserted.role_id = role.role_id; `,

  CHECK_EMAIL_IS_EXIST: `SELECT COUNT(*) FROM account WHERE email = $1`,
  GET_DATA_FOR_LOGIN: `SELECT account.user_id,account.first_name,account.last_name,account.password,role.name as role FROM account 
                        inner JOIN role ON account.role_id=role.role_id WHERE email = $1`,
  GET_ACCOUNT_PASSWORD: `SELECT password FROM account WHERE user_id= $1`,
  UPDATE_ACCOUNT_PASSWORD: `UPDATE account SET password = $1  WHERE user_id=$2`,

  //                                       ACCOUNT RECOVERY
  UPDATE_PASSWORD_VERIFICATION_TOKEN: `UPDATE account SET reset_password_token = $1
   ,reset_password_expires =  (to_timestamp($2/ 1000.0))  WHERE user_id=$3`,
  CHECH_TOKENT_IS_FIND: `SELECT reset_password_expires FROM account where reset_password_token = $1`,
  RESET_ACCOUNT_PASSWORD: `UPDATE account SET password = $1 , reset_password_token= null ,reset_password_expires =null WHERE reset_password_token=$2`,
};
