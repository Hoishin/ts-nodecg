# ts-nodecg

Strongly typed NodeCG wrapper for messages and replicants

## Supported Methods:

- `sendMessage`
- `listenFor`
- `unlisten`
- `Replicant`
- `readReplicant` (only in browser context)

## Usage

```ts
const typedNodeCGHelper = createTypedNodeCGHelper(nodecg)

typedNodeCGHelper.sendMessage('foo')
typedNodeCGHelper.listenFor('foo')
```

## License

MIT &copy; Keiichiro Amemiya (Hoishin)
