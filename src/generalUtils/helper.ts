import { EditUserDto } from 'src/modules/users/dto/editUser.dto';

export const deleteObjProps = (object: Object, props: Array<string>) => {
  for (let prop of props) {
    delete object[prop];
  }
};

export const updateObjProps = (src: object, dest: object) => {
  Object.keys(dest).forEach((obj) => {
    if(src[obj])
    src[obj] = dest[obj] ? dest[obj] : src[obj];
  });
};
