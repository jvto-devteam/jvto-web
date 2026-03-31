$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$envFile = Join-Path $repoRoot ".env.local"

if (!(Test-Path $envFile)) {
  throw "Missing .env.local at $envFile"
}

$allowedKeys = @(
  "DATABASE_URL",
  "BASE_CURRENCY",
  "DISPLAY_CURRENCIES",
  "REFUND_WINDOW_HOURS",
  "NO_SHOW_RESCHEDULE_FEE",
  "NEXT_PUBLIC_GA_MEASUREMENT_ID",
  "NEXT_PUBLIC_BASE_URL",
  "NEXT_PUBLIC_SITE_URL",
  "NEXT_PUBLIC_LEGACY_URL",
  "NEXT_PUBLIC_LEGACY_URL_DOMAIN",
  "NEXT_PUBLIC_IS_FIREBASE",
  "NEXT_PUBLIC_GTM_ID",
  "NEXTAUTH_URL",
  "NEXTAUTH_SECRET",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "EMAIL_SERVER_HOST",
  "EMAIL_SERVER_PORT",
  "EMAIL_SERVER_USER",
  "EMAIL_SERVER_PASSWORD",
  "EMAIL_FROM",
  "KNOWN_AGENTS_TOKEN"
)

$vars = [ordered]@{}

Get-Content -Path $envFile | ForEach-Object {
  $line = $_.Trim()
  if (-not $line -or $line.StartsWith("#")) {
    return
  }

  $parts = $line -split "=", 2
  if ($parts.Count -ne 2) {
    return
  }

  $key = $parts[0].Trim()
  if ($allowedKeys -notcontains $key) {
    return
  }

  $value = $parts[1].Trim()
  if (
    ($value.StartsWith('"') -and $value.EndsWith('"')) -or
    ($value.StartsWith("'") -and $value.EndsWith("'"))
  ) {
    $value = $value.Substring(1, $value.Length - 2)
  }

  $vars[$key] = $value
}

if ($vars.Count -eq 0) {
  throw "No deploy variables were loaded from .env.local"
}

$args = @("deploy", "--yes", "--scope", "sams-projects-6638b46d")

foreach ($entry in $vars.GetEnumerator()) {
  $args += @("--build-env", "$($entry.Key)=$($entry.Value)")
}

foreach ($entry in $vars.GetEnumerator()) {
  $args += @("--env", "$($entry.Key)=$($entry.Value)")
}

Push-Location $repoRoot
try {
  & vercel @args
} finally {
  Pop-Location
}
