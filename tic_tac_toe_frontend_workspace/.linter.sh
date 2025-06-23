#!/bin/bash
cd /home/kavia/workspace/code-generation/reacttictactoe-66366-1ee4e8ac/tic_tac_toe_frontend_workspace/tic_tac_toe_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

