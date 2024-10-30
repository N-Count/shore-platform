const jgyIconImg = {
  forecastIcon:
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBmaWxsPSJub25lIiB2ZXJzaW9uPSIxLjEiIHdpZHRoPSIyNiIgaGVpZ2h0PSIxNCIgdmlld0JveD0iMCAwIDI2IDE0Ij48ZyBzdHlsZT0ibWl4LWJsZW5kLW1vZGU6cGFzc3Rocm91Z2giPjxwYXRoIGQ9Ik0wIDBDMCAwIDAgMCAwIDBMMjEgMEMyMy43NjE0MjM3NDkxNTM5NjYgMCAyNiAyLjIzODU3NjI1MDg0NjAzMzQgMjYgNUwyNiAxNEMyNiAxNCAyNiAxNCAyNiAxNEw1IDE0QzIuMjM4NTc2MjUwODQ2MDMzNCAxNCAwIDExLjc2MTQyMzc0OTE1Mzk2NiAwIDlaIiBmaWxsPSIjRTYwMDEyIiBmaWxsLW9wYWNpdHk9IjEiLz48ZyBzdHlsZT0ibWl4LWJsZW5kLW1vZGU6cGFzc3Rocm91Z2giPjxwYXRoIGQ9Ik04LjEyMjA3LDIuODg5NjVMOC4xMjIwNywzLjc3MTQ4TDkuOTY0ODM5OTk5OTk5OTk5LDMuNzcxNDhDOS45Mjk2OSw0LjAyNjM3LDkuODk0NTMsNC4yNzgzMiw5LjgzODg3LDQuNTA5NzdMOC4zNTM1Miw0LjUwOTc3TDguMzUzNTIsOC44OTU1MUw5LjIzODI4LDguODk1NTFMOS4yMzgyOCw1LjMzODg3TDExLjQ5NzA3LDUuMzM4ODdMMTEuNDk3MDcsOC44OTU1MUwxMi4zNzg5MSw4Ljg5NTUxTDEyLjM3ODkxLDQuNTA5NzdMMTAuNzUsNC41MDk3N0MxMC44MDI3Myw0LjI3ODMyLDEwLjg0NjY4LDQuMDI2MzcsMTAuODg0NzcsMy43NzE0OEwxMi42MjIwNywzLjc3MTQ4TDEyLjYyMjA3LDIuODg5NjVMOC4xMjIwNywyLjg4OTY1Wk0xMS4xNDU1MSw4LjgzMTA1TDEwLjU0MTk5LDkuNDE2OTlDMTEuMTk4MjQsOS45NTYwNSwxMS43MDIxNSwxMC40Njg4LDEyLjA2MjUsMTAuOTM3NUwxMi43MjE2OCwxMC4yODEyQzEyLjI4ODA5LDkuODAzNzEsMTEuNzU3ODEsOS4zMTczOCwxMS4xNDU1MSw4LjgzMTA1Wk05Ljg5NDUzLDUuNzYwNzRMOS44OTQ1Myw3LjM0NTdDOS44NTkzOCw4LjA2NjQxLDkuNjk1MzEsOC42NDM1NSw5LjQwODIsOS4wOTE4QzkuMTAwNTksOS41MDc4MSw4LjUyNjM3LDkuODQ3NjYsNy42Nzk2OSwxMC4xMjg5TDguMTkyMzgsMTAuOTI4N0M5LjA3NDIyLDEwLjY0MTYsOS43MjE2OCwxMC4yMTY4LDEwLjEyODkxMDAwMDAwMDAwMSw5LjY3NzczQzEwLjUzMzIsOS4xMDA1OSwxMC43NTg3OTAwMDAwMDAwMDEsOC4zMTgzNiwxMC43OTM5NDk5OTk5OTk5OTksNy4zNDU3TDEwLjc5Mzk0OTk5OTk5OTk5OSw1Ljc2MDc0TDkuODk0NTMsNS43NjA3NFpNNS40NTYwNSw0LjA3OTFMNC43NzM0MzgsNC41MDk3N0M1LjE4NjUyLDQuOTI1NzgsNS41NTU2Niw1LjMxMjUsNS44ODA4Niw1LjY4MTY0TDQuMzU3NDIyLDUuNjgxNjRMNC4zNTc0MjIsNi41NDU5TDUuNTU1NjYsNi41NDU5TDUuNTU1NjYsOS44MTI1QzUuNTU1NjYsMTAsNS40ODI0MiwxMC4wOTk2LDUuMzM4ODcsMTAuMDk5NkM1LjA5NTcsMTAuMDk5Niw0Ljg0Mzc1LDEwLjA4Miw0LjU3NDIxOSwxMC4wNDY5TDQuNzczNDM4LDEwLjg5MzZMNS42NTUyNywxMC44OTM2QzYuMTc2NzYsMTAuODkzNiw2LjQ0NjI4OTk5OTk5OTk5OSwxMC42MDM1LDYuNDQ2Mjg5OTk5OTk5OTk5LDEwLjAzODFMNi40NDYyODk5OTk5OTk5OTksNi41NDU5TDcuMDkzNzUsNi41NDU5QzYuOTc2NTYsNi45NTAyLDYuODUwNTksNy4zMDE3Niw2LjcwNzAzLDcuNTk3NjZMNy40NzE2OCw3Ljg5NjQ4QzcuNjYyMTEsNy40OTgwNSw3LjgyMzI0LDYuOTUwMiw3Ljk2NjgsNi4yNDcwN0w3Ljk2NjgsNS42ODE2NEw2Ljg5NzQ2MDAwMDAwMDAwMSw1LjY4MTY0QzYuNzk3ODUsNS41NTU2Niw2LjY4OTQ1LDUuNDIwOSw2LjU3MjI3LDUuMjg2MTNDNi45ODUzNSw0LjgyNjE3LDcuMzc1LDQuMjY2Niw3LjcyMzYzLDMuNjE5MTRMNy43MjM2MywyLjg4OTY1TDQuNjA5Mzc1LDIuODg5NjVMNC42MDkzNzUsMy43NTM5MUw2LjcyNDYxLDMuNzUzOTFDNi41MTA3NCw0LjA5NjY4LDYuMjg1MTU5OTk5OTk5OTk5LDQuNDEzMDksNi4wNDE5OSw0LjY4MjYyQzUuODYwMzUsNC40ODM0LDUuNjcyODUsNC4yODcxMSw1LjQ1NjA1LDQuMDc5MVpNMTQuMDc4MSwyLjczNzNMMTMuNDQ4MjQsMy4zNDA4MkMxMy45OTkwMiwzLjc4MzIsMTQuNDIwOSw0LjE5NjI5LDE0LjcwOCw0LjU3NDIyTDE1LjMyMDMsMy45NjE5MUMxNC45Nzc1LDMuNTU3NjIsMTQuNTY0NSwzLjE1MzMyLDE0LjA3ODEsMi43MzczWk0xMy45MzQ1Nyw0Ljk0MzM2TDEzLjMwNDY5LDUuNTQ2ODhDMTMuODM0OTYsNi4wMTI3LDE0LjI1MSw2LjQ1NTA4LDE0LjUzODEsNi44NjgxNkwxNS4xNDE2LDYuMjU1ODZDMTQuODE2NCw1LjgyNTIsMTQuNDEyMSw1LjM4MjgxLDEzLjkzNDU3LDQuOTQzMzZaTTE0LjQ3MzYsNy40MTg5NUMxNC4xNTE0LDguNDUzMTIsMTMuNzgyMjMsOS40Njk3MywxMy4zNDg2MywxMC40Njg4TDE0LjE5NTMsMTAuODM3OUMxNC41OTA4LDkuODY1MjMsMTQuOTQyNCw4LjgzMTA1LDE1LjI2NzYsNy43MzI0MkwxNC40NzM2LDcuNDE4OTVaTTE4Ljc0MjIsMy4wMjQ0MUwxNS40NzI3LDMuMDI0NDFMMTUuNDcyNyw4LjY2OTkyTDE2LjMwMTgsOC42Njk5MkwxNi4zMDE4LDMuODI3MTVMMTcuOTEzMSwzLjgyNzE1TDE3LjkxMzEsOC42MTQyNkwxOC43NDIyLDguNjE0MjZMMTguNzQyMiwzLjAyNDQxWk0xNy43NzgzLDguOTU3MDNMMTcuMjE4OCw5LjUwNzgxQzE3Ljc1MjAwMDAwMDAwMDAwMiwxMC4wMjA1LDE4LjE1NjIsMTAuNDk1MSwxOC40NDM0LDEwLjk0NjNMMTkuMDczMiwxMC4zMjUyQzE4LjcxMjg5OTk5OTk5OTk5OCw5Ljg3NDAyLDE4LjI4MjIsOS40MTY5OSwxNy43NzgzLDguOTU3MDNaTTE2LjcyMzU5OTk5OTk5OTk5OCw0LjMwNDY5TDE2LjcyMzU5OTk5OTk5OTk5OCw3LjEyMDEyQzE2LjY5NzMsNy45MTQwNiwxNi41NzEzLDguNTUyNzMsMTYuMzU0NSw5LjAzOTA2QzE2LjEzMTgsOS40ODczLDE1LjY5ODIsOS44NzQwMiwxNS4wNTk2LDEwLjE4MTZMMTUuNTQ1OSwxMC45NjM5QzE2LjIxMDkwMDAwMDAwMDAwMiwxMC42NTA0LDE2LjY5NzMsMTAuMTk5MiwxNi45OTYxLDkuNjIyMDdDMTcuMzAwODAwMDAwMDAwMDAyLDguOTkyMTksMTcuNDYxOSw4LjE2NjAyLDE3LjUsNy4xMjAxMkwxNy41LDQuMzA0NjlMMTYuNzIzNTk5OTk5OTk5OTk4LDQuMzA0NjlaTTIwLjU0OTgsMTAuODY0M0MyMS4xMDk0LDEwLjg2NDMsMjEuMzg3NywxMC41NTk2LDIxLjM4NzcsOS45NTYwNUwyMS4zODc3LDIuNjY2OTlMMjAuNTA1OSwyLjY2Njk5TDIwLjUwNTksOS43MzA0N0MyMC41MDU5LDkuOTQ3MjcsMjAuNDE1LDEwLjA2NDUsMjAuMjQ1MSwxMC4wNjQ1QzE5Ljk2MzkwMDAwMDAwMDAwMiwxMC4wNjQ1LDE5LjY2OCwxMC4wMzgxLDE5LjM2MzMwMDAwMDAwMDAwMiwxMEwxOS41NTk2LDEwLjg2NDNMMjAuNTQ5OCwxMC44NjQzWk0xOS4xOTkxOTk5OTk5OTk5OTgsMy40MDUyN0wxOS4xOTkxOTk5OTk5OTk5OTgsOC45NDgyNEwyMC4wMTk1LDguOTQ4MjRMMjAuMDE5NSwzLjQwNTI3TDE5LjE5OTE5OTk5OTk5OTk5OCwzLjQwNTI3WiIgZmlsbD0iI0ZGRkZGRiIgZmlsbC1vcGFjaXR5PSIxIi8+PC9nPjwvZz48L3N2Zz4=',
  hotIcon:
    'data:image/png;base64,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',
  newIcon:
    '<svg t="1694685173886" class="icon" viewBox="0 0 1901 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7703" width="12" height="12"><path d="M0 512a512 512 0 0 1 512-512h877.714286a512 512 0 0 1 0 1024H0z" fill="#E60012" p-id="7704"></path><path d="M639.926857 249.563429H544.182857v315.977142l-185.929143-315.977142H262.509714v504.539428h95.744V438.857143l185.929143 315.245714H640V249.563429z m175.469714 83.382857h224.548572v-83.382857H719.579429v504.539428h320.219428V670.72h-224.548571V541.257143h191.707428V457.874286h-191.634285V333.019429z m863.524572-83.382857h-89.014857l-71.68 356.205714-77.604572-356.205714h-119.222857l-73.874286 356.205714-76.214857-356.205714h-95.670857l124.269714 504.539428h87.113143l91.428572-373.540571 92.16 373.540571h87.625143l120.685714-504.539428z" fill="#FFFFFF" p-id="7705"></path></svg>'
}
export default jgyIconImg
