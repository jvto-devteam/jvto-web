// Crew role predicate — single, case-insensitive source of the guide/driver test.
//
// crew_members.type casing differs by database: jvto_dev (main/preview) stores the
// capitalized form ('Guide' / 'Driver'), while prod `jvto` stores lowercase
// ('guide' / 'driver'). Any `type === 'Guide'` comparison is therefore correct on
// one DB and silently wrong on the other — on prod it would classify EVERY crew
// member as a driver, mislabeling the 7 guides' role + KTA credential in the /team
// Person schema. Route all guide/driver branching through here so both DBs render
// correctly without a data migration.
export function isGuideRole(type?: string | null): boolean {
  return (type ?? '').trim().toLowerCase() === 'guide';
}
