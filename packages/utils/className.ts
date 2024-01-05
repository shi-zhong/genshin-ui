interface ClassNameObject {
  [key: string]: ClassNameObject | string[] | string | number | boolean;
}

/**
 * 接受一个对象，根据对象的值，拼接前缀后返回
 * 接受一个字符串, 拼接后返回
 * 第一级接受undefined时，返回前缀，当非原始类型时，undefined会直接删除，使用 '' 替代
 * 接受一个数组，对每个元素执行以上操作后返回
 *
 * 当层数过深时，函数失去原有的便捷功能，参数难以阅读数，所以入参稍有限制
 */
type classNameProps = string | ClassNameObject | undefined | classNameProps[];

const ClassName = (classinfo: classNameProps, prefix: string = '') => {
  if (classinfo === undefined) return prefix;
  return handleStyleInfos(classinfo, prefix).join(' ');
};

const ClassNameWithCSSModule = (
  Style: any,
  classinfo: classNameProps,
  prefix: string,
  debug?: boolean
) => {
  if (classinfo === undefined) return Style[prefix] || '';
  return handleStyleInfos(classinfo, prefix)
    .map((i) => {
      if (Style[i] !== undefined) {
        return Style[i];
      } else if (debug) {
        console.log(i + ' is not in', Style);
      }
      return '';
    })
    .join(' ');
};

const handleStyleInfos = (classinfo: classNameProps, prefix: string = ''): string[] => {
  if (classinfo instanceof Array) {
    return classinfo.map((i) => handleStyleInfos(i, prefix)).flat();
  } else if (typeof classinfo === 'object') {
    return ClassNameObjectToList(classinfo, prefix);
  } else if (typeof classinfo === 'string') {
    return [prefix + classinfo];
  }
  return [];
};

const ClassNameArrayAddPrefix = (classList: string[], prefix: string): string[] =>
  classList.map((item) => prefix + item);

const ClassNameObjectToList = (classNameObject: ClassNameObject, prefix: string): string[] => {
  let classNameList: string[] = [];

  for (const [key, value] of Object.entries(classNameObject)) {
    if (typeof value === 'boolean' || typeof value === 'string' || typeof value === 'number') {
      if (value) {
        classNameList.push(key);
      }
    } else if (value instanceof Array) {
      classNameList = classNameList.concat(ClassNameArrayAddPrefix(value, key));
    } else if (value instanceof Object) {
      classNameList = classNameList.concat(ClassNameObjectToList(value as ClassNameObject, key));
    }
  }

  return ClassNameArrayAddPrefix(classNameList, prefix);
};

const ClassNameFactor = (prefix?: string) => {
  return (classinfo?: string[] | ClassNameObject | string | undefined) =>
    ClassName(classinfo, prefix);
};

const ClassNameWithCSSModuleFactor = (cssModule: any, prefix?: string, debug?: boolean) => {
  return (classinfo?: string[] | ClassNameObject | string | undefined) =>
    ClassNameWithCSSModule(cssModule, classinfo, prefix || '', debug);
};

export { ClassName, ClassNameWithCSSModule, ClassNameFactor, ClassNameWithCSSModuleFactor };
