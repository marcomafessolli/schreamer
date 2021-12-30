function makeWriter(type, converter) {
  var bufferMethodNames = {
    'be': null,
    'le': null,
  };

  if (type === 'Int8' || type === 'UInt8') {
    bufferMethodNames['be'] = `write${type}`;
    bufferMethodNames['le'] = `write${type}`;
  } else {
    bufferMethodNames['be'] = `write${type}BE`;
    bufferMethodNames['le'] = `write${type}LE`;
  }

  return function(buffer, _value, offset) {
    var value       = _value;
    var endian      = this['endian'];
    var methodName  = bufferMethodNames[endian];

    if (typeof converter === 'function')
      value = converter(value);

    buffer[methodName](value, offset);
  };
}

function makeReader(type) {
  var bufferMethodNames = {
    'be': null,
    'le': null,
  };

  if (type === 'Int8' || type === 'UInt8') {
    bufferMethodNames['be'] = `read${type}`;
    bufferMethodNames['le'] = `read${type}`;
  } else {
    bufferMethodNames['be'] = `read${type}BE`;
    bufferMethodNames['le'] = `read${type}LE`;
  }

  return function(buffer, offset) {
    var endian      = this['endian'];
    var methodName  = bufferMethodNames[endian];

    buffer[methodName](offset);
  };
}

function makeNode(defintion, _childrenKey) {
  var childrenKey = _childrenKey || 'children';
  var children    = defintion[childrenKey];

  if (!children && !_childrenKey)
    children = defintion['value'];

  if (!children || !(children instanceof Array))
    return defintion;

  for (var i = 0, il = children.length; i < il; i++) {
    var child = children[i];
    if (!child || !child.type)
      continue;

    child.parent = defintion;
  }

  return defintion;
}

function BIG_ENDIAN(...children) {
  return makeNode({
    type: 'big_endian',
    children: (children.length === 1 && children[0] instanceof Array) ? children[0] : children,
  });
}

function LITTLE_ENDIAN(...children) {
  return makeNode({
    type: 'little_endian',
    children: (children.length === 1 && children[0] instanceof Array) ? children[0] : children,
  });
}

function DIR(path, ...children) {
  return makeNode({
    type: 'dir',
    path,
    children: (children.length === 1 && children[0] instanceof Array) ? children[0] : children,
  });
}

function FILE(path, ...children) {
  return makeNode({
    type: 'file',
    path,
    children: (children.length === 1 && children[0] instanceof Array) ? children[0] : children,
  });
}

function I8(name, value) {
  return makeNode({
    type: 'i8',
    name,
    value,
    byteSize: 1,
    writer: makeWriter('Int8'),
    reader: makeReader('Int8'),
  });
}

function U8(name, value) {
  return makeNode({
    type: 'u8',
    name,
    value,
    byteSize: 1,
    writer: makeWriter('UInt8'),
    reader: makeReader('UInt8'),
  });
}

function I16(name, value) {
  return makeNode({
    type: 'i16',
    name,
    value,
    byteSize: 2,
    writer: makeWriter('Int16'),
    reader: makeReader('Int16'),
  });
}

function U16(name, value) {
  return makeNode({
    type: 'u16',
    name,
    value,
    byteSize: 2,
    writer: makeWriter('UInt16'),
    reader: makeReader('UInt16'),
  });
}

function I32(name, value) {
  return makeNode({
    type: 'i32',
    name,
    value,
    byteSize: 4,
    writer: makeWriter('Int32'),
    reader: makeReader('Int32'),
  });
}

function U32(name, value) {
  return makeNode({
    type: 'u32',
    name,
    value,
    byteSize: 4,
    writer: makeWriter('UInt32'),
    reader: makeReader('UInt32'),
  });
}

function I64(name, value) {
  return makeNode({
    type: 'i64',
    name,
    value,
    byteSize: 8,
    writer: makeWriter('BigInt64', BigInt),
    reader: makeReader('BigInt64'),
  });
}

function U64(name, value) {
  return makeNode({
    type: 'u64',
    name,
    value,
    byteSize: 8,
    writer: makeWriter('BigUInt64', BigInt),
    reader: makeReader('BigUInt64'),
  });
}

function F32(name, value) {
  return makeNode({
    type: 'f32',
    name,
    value,
    byteSize: 4,
    writer: makeWriter('Float'),
    reader: makeReader('Float'),
  });
}

function F64(name, value) {
  return makeNode({
    type: 'f64',
    name,
    value,
    byteSize: 8,
    writer: makeWriter('Double'),
    reader: makeReader('Double'),
  });
}

function LATIN1(name, value) {
  return makeNode({
    type: 'latin1',
    name,
    value,
    byteSize: (node, value) => {},
  });
}

function UTF16(name, value) {
  return makeNode({
    type: 'utf16',
    name,
    value,
    byteSize: (node, value) => {},
  });
}

function UTF8(name, value) {
  return makeNode({
    type: 'utf8',
    name,
    value,
    byteSize: (node, value) => {},
  });
}

module.exports = {
  BIG_ENDIAN,
  LITTLE_ENDIAN,
  DIR,
  FILE,
  I8,
  U8,
  I16,
  U16,
  I32,
  U32,
  I64,
  U64,
  F32,
  F64,
  LATIN1,
  UTF16,
  UTF8,
};
