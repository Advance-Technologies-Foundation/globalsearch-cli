export const PSQL_SYS_SETTINGS = `
UPDATE "SysSettingsValue"
SET "TextValue" = '{{GlobalSearchUrl}}'
WHERE "SysSettingsId" = (SELECT "Id" FROM "SysSettings" WHERE "Code" = 'GlobalSearchUrl' LIMIT 1);

UPDATE "SysSettingsValue"
SET "TextValue" = '{{GlobalSearchConfigServiceUrl}}'
WHERE "SysSettingsId" = (SELECT "Id" FROM "SysSettings" WHERE "Code" = 'GlobalSearchConfigServiceUrl' LIMIT 1);

UPDATE "SysSettingsValue"
SET "TextValue" = '{{GlobalSearchIndexingApiUrl}}'
WHERE "SysSettingsId" = (SELECT "Id" FROM "SysSettings" WHERE "Code" = 'GlobalSearchIndexingApiUrl' LIMIT 1);
`
