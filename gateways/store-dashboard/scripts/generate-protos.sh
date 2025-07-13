#!/bin/bash

set -e

PROTO_DIR=./proto
OUT_DIR=./src/common/proto
PROTOC_GEN_TS_PROTO=./node_modules/.bin/protoc-gen-ts_proto

echo "Cleaning previous output..."
rm -rf "$OUT_DIR"
mkdir -p "$OUT_DIR"

echo "Generating TypeScript gRPC code with ts-proto..."

# Find all .proto files recursively and loop over them
find "$PROTO_DIR" -name "*.proto" | while read -r file; do
  echo "Processing $file..."
  protoc \
    --plugin=protoc-gen-ts="$PROTOC_GEN_TS_PROTO" \
    --ts_proto_out="$OUT_DIR" \
    --ts_proto_opt=nestJs=true,outputServices=grpc-js,env=node,onlyGenerateServices=true \
    -I "$PROTO_DIR" \
    -I ./node_modules/google-proto-files \
    "$file"
done

echo "✅ All proto files generated successfully."
