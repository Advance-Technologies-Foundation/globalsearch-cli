export const MSSQL_SYS_SETTINGS = `
UPDATE SysSettingsValue
SET TextValue = '{{GlobalSearchUrl}}'
WHERE SysSettingsId = (SELECT TOP 1 Id FROM SysSettings WHERE Code ='GlobalSearchUrl')

UPDATE SysSettingsValue
SET TextValue = '{{GlobalSearchConfigServiceUrl}}'
WHERE SysSettingsId = (SELECT TOP 1 Id FROM SysSettings WHERE Code ='GlobalSearchConfigServiceUrl')

UPDATE SysSettingsValue
SET TextValue = '{{GlobalSearchIndexingApiUrl}}'
WHERE SysSettingsId = (SELECT TOP 1 Id FROM SysSettings WHERE Code ='GlobalSearchIndexingApiUrl')
`
