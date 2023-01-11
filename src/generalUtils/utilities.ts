export function camelToUnderscore(key) {
  return key.replace(/([A-Z])/g, "_$1").toLowerCase();
}

export function camelCaseKeysToUnderscore(obj) {
  if (typeof obj != "object") return obj;

  for (var oldName in obj) {
    // Camel to underscore
    let newName = oldName.replace(/([A-Z])/g, function ($1) {
      return "_" + $1.toLowerCase();
    });

    // Only process if names are different
    if (newName != oldName) {
      // Check for the old property name to avoid a ReferenceError in strict mode.
      if (obj.hasOwnProperty(oldName)) {
        obj[newName] = obj[oldName];
        delete obj[oldName];
      }
    }

    // Recursion
    if (typeof obj[newName] == "object") {
      obj[newName] = camelCaseKeysToUnderscore(obj[newName]);
    }
  }
  return obj;
}

import { Redshift } from "aws-sdk";
import jwt_decode from "jwt-decode";
import { camelCase } from "lodash";
import { constants } from "src/modules/auth/constants";
import { User } from "src/modules/users/entities/users.entity";

export const camelizeKeys = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map((v) => camelizeKeys(v));
  } else if (obj != null && obj.constructor === Object) {
    return Object.keys(obj).reduce(
      (result, key) => ({
        ...result,
        [camelCase(key)]: camelizeKeys(obj[key]),
      }),
      {}
    );
  }
  return obj;
};

export const verifyTenant = async (req) => {
  let domainPrefix;
  let user;
  let organizationId;
  const { rawHeaders, headers } = req;
  const token = headers.authorization?.split(" ");
  const UrlHostArray = headers.host?.split(".");
  if (UrlHostArray?.length > 1) {
    domainPrefix = UrlHostArray[0];
  }
  if (token) {
    const decoded: any = jwt_decode(token[1]);
    const email = decoded.email;

    user = await User.findOne({ email });
    organizationId = user?.organizationId;
  }

  if (
    (user.organization && user.organization.domainPrefix.toLowerCase() == domainPrefix.toLowerCase()) ||
    user.type == constants.SuperAdminTypeName
  ) {
    return true;
  } else {
    return false;
    // throw new BadRequestException("Invalid Domain Prefix");
  }
};

export function updateMultiple(table, recordRows) {
  var valueSets = new Array();
  var cSet = new Set();
  var columns = new Array();
  for (const [key, value] of Object.entries(recordRows.rows)) {
    var groupArray = new Array();
    for (const [key2, value2] of Object.entries(recordRows.rows[key])) {
      if (!cSet.has(key2)) {
        cSet.add(`${key2}`);
        columns.push(key2);
      }
      groupArray.push(`${value2}`);
    }
    valueSets.push(`(${groupArray.toString()})`);
  }
  var valueSetsString = valueSets.join();
  var setMappings = new String();
  for (var i = 0; i < columns.length; i++) {
    var fieldSet = columns[i];

    setMappings += `${fieldSet} = c.${fieldSet}`;
    if (i < columns.length - 1) {
      setMappings += ", ";
    }
  }
  var qstring = `UPDATE ${table} AS t SET ${setMappings} FROM (VALUES ${valueSetsString}) AS c(${columns}) WHERE c.id = t.id`;
  return qstring;
}
