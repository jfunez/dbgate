module.exports = `
select 
	TABLE_NAME as pureName, 
	COLUMN_NAME as columnName,
	IS_NULLABLE as isNullable,
	DATA_TYPE as dataType,
	CHARACTER_MAXIMUM_LENGTH,
	NUMERIC_PRECISION,
	NUMERIC_SCALE,
	COLUMN_DEFAULT,
	EXTRA as extra
from INFORMATION_SCHEMA.COLUMNS
where TABLE_SCHEMA = '#DATABASE#' and TABLE_NAME =[OBJECT_NAME_CONDITION]
order by ORDINAL_POSITION
`;